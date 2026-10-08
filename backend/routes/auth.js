const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { getJwtSecret } = require('../config/jwt');
const router = express.Router();

// Helper: get setting value
async function getSetting(key) {
  const r = await db.query('SELECT setting_value FROM system_settings WHERE setting_key = ?', [key]);
  return r.rows.length > 0 ? r.rows[0].setting_value : null;
}

// Register (coordinator/admin uses this directly; students use token-register if self_register=off)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student', studentId, phone, school, title, program, level, className, teachingSubject, topic, tpStartDate, tpEndDate } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedStudentId = role === 'student' ? (studentId || '').trim().toUpperCase() : (studentId || '').trim();

    if (!normalizedEmail || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
    }
    if (role === 'student' && !normalizedStudentId) {
      return res.status(400).json({ error: 'A registration number is required for student accounts' });
    }

    // Check coordinator limit
    if (role === 'coordinator') {
      const maxCoords = parseInt(await getSetting('max_coordinators')) || 5;
      const coordCount = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'coordinator'");
      if (parseInt(coordCount.rows[0].count) >= maxCoords) {
        return res.status(400).json({ error: `Maximum of ${maxCoords} coordinators allowed in the system` });
      }
    }

    // Admin role cannot be self-registered
    if (role === 'admin') return res.status(403).json({ error: 'Cannot register admin accounts' });

    const userCheck = await db.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (userCheck.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const ins = await db.insert(
      'INSERT INTO users (email, password, first_name, last_name, role, student_id, phone, school, title, program, level, class_name, teaching_subject, topic, tp_start_date, tp_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [normalizedEmail, hashedPassword, firstName.trim(), lastName.trim(), role, normalizedStudentId || null, phone || null, school || null, title || null, program || null, level || null, className || null, teachingSubject || null, topic || null, tpStartDate || null, tpEndDate || null]
    );
    const result = await db.query('SELECT id, email, role FROM users WHERE id = ?', [ins.insertId]);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Token-based self-registration
router.post('/token-register', async (req, res) => {
  try {
    const { token, email, password, firstName, lastName, studentId, phone, school } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!token) return res.status(400).json({ error: 'Registration token is required' });
    if (!normalizedEmail || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Token-based register is ALWAYS allowed if a valid token is provided
    // Validate token
    const tokenResult = await db.query(
      'SELECT * FROM registration_tokens WHERE token = ? AND used = false',
      [token.toUpperCase()]
    );
    if (tokenResult.rows.length === 0) return res.status(400).json({ error: 'Invalid or already used token' });
    const regToken = tokenResult.rows[0];
    if (regToken.expires_at && new Date(regToken.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    const normalizedStudentId = regToken.role === 'student' ? (studentId || '').trim().toUpperCase() : (studentId || '').trim();
    if (regToken.role === 'student' && !normalizedStudentId) {
      return res.status(400).json({ error: 'A registration number is required for student accounts' });
    }

    const userCheck = await db.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (userCheck.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const ins = await db.insert(
      'INSERT INTO users (email, password, first_name, last_name, role, student_id, phone, school, title, program, level, class_name, teaching_subject, topic, tp_start_date, tp_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [normalizedEmail, hashedPassword, firstName.trim(), lastName.trim(), regToken.role, normalizedStudentId || null, phone || null, school || null, null, null, null, null, null, null, null, null]
    );

    // Mark token as used
    await db.query('UPDATE registration_tokens SET used = true, used_by = ? WHERE id = ?', [ins.insertId, regToken.id]);

    res.status(201).json({ message: 'Registration successful! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const normalizedEmail = (email || '').trim().toLowerCase();
    const result = await db.query('SELECT * FROM users WHERE email = ? AND is_active = true', [normalizedEmail]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    let validPassword = await bcrypt.compare(password, user.password);
    const isPlainPassword = !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$');
    if (!validPassword && isPlainPassword) {
      validPassword = user.password === password;
      if (validPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
      }
    }
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        studentId: user.student_id,
        phone: user.phone,
        school: user.school,
        title: user.title || null,
        program: user.program || null,
        level: user.level || null,
        profilePicture: user.profile_picture || null,
        className: user.class_name || null,
        teachingSubject: user.teaching_subject || null,
        topic: user.topic || null,
        tpStartDate: user.tp_start_date || null,
        tpEndDate: user.tp_end_date || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get own profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, student_id, phone, school, title, program, level, class_name, teaching_subject, topic, tp_start_date, tp_end_date, profile_picture, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update own profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, school, title, program, level, className, teachingSubject, topic, tpStartDate, tpEndDate } = req.body;
    await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, school = ?, title = ?, program = ?, level = ?, class_name = ?, teaching_subject = ?, topic = ?, tp_start_date = ?, tp_end_date = ? WHERE id = ?',
      [firstName, lastName, phone || null, school || null, title || null, program || null, level || null, className || null, teachingSubject || null, topic || null, tpStartDate || null, tpEndDate || null, req.user.id]
    );
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, student_id, phone, school, title, program, level, class_name, teaching_subject, topic, tp_start_date, tp_end_date, profile_picture FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
    const result = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (result.rows.length === 0) return res.json({ message: 'If that email exists, a reset link has been sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);
    await db.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [token, expires, email]);
    console.log(`Reset token for ${email}: ${token}`);
    res.json({ message: 'If that email exists, a reset link has been sent.', devToken: process.env.NODE_ENV === 'development' ? token : undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const result = await db.query('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashed, result.rows[0].id]);
    res.json({ message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

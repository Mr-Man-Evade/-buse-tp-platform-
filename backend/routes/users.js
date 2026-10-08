const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// Profile picture storage
const ppStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const ppUpload = multer({
  storage: ppStorage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg','image/png','image/webp'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get all users with search/filter
router.get('/', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const { search, role: filterRole } = req.query;
    let sql = 'SELECT id, email, first_name, last_name, role, student_id, phone, school, is_active, profile_picture, created_at FROM users WHERE 1=1';
    const params = [];
    if (search) {
      sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR student_id LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }
    if (filterRole) { sql += ' AND role = ?'; params.push(filterRole); }
    sql += ' ORDER BY created_at DESC';
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile by id
router.get('/profile/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, student_id, phone, school, class_name, teaching_subject, topic, tp_start_date, tp_end_date, is_active, profile_picture, title, program, level, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users by role
router.get('/role/:role', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, student_id, profile_picture FROM users WHERE role = ? AND is_active = true ORDER BY first_name',
      [req.params.role]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload profile picture
router.post('/profile-picture', authMiddleware, ppUpload.single('picture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const picPath = `uploads/profiles/${req.file.filename}`;
    await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [picPath, req.user.id]);
    res.json({ message: 'Profile picture updated', profilePicture: picPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (coordinator/admin)
router.put('/:id', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const { firstName, lastName, email, role, studentId, phone, school, title, program, level, className, teachingSubject, topic, tpStartDate, tpEndDate } = req.body;
    const existing = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ?, student_id = ?, phone = ?, school = ?, title = ?, program = ?, level = ?, class_name = ?, teaching_subject = ?, topic = ?, tp_start_date = ?, tp_end_date = ? WHERE id = ?',
      [firstName, lastName, email, role, studentId || null, phone || null, school || null, title || null, program || null, level || null, className || null, teachingSubject || null, topic || null, tpStartDate || null, tpEndDate || null, req.params.id]
    );
    const result = await db.query('SELECT id, email, first_name, last_name, role, student_id, phone, school, title, program, level, class_name, teaching_subject, topic, tp_start_date, tp_end_date, is_active FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User updated', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle active status
router.patch('/:id/toggle-active', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const current = await db.query('SELECT is_active FROM users WHERE id = ?', [req.params.id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const newStatus = !current.rows[0].is_active;
    await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);
    res.json({ message: `User ${newStatus ? 'activated' : 'deactivated'}`, is_active: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset user password
router.post('/:id/reset-password', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (coordinator/admin)
router.delete('/:id', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const existing = await db.query('SELECT id, role FROM users WHERE id = ?', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    if (existing.rows[0].role === 'admin') return res.status(403).json({ error: 'Cannot delete admin users' });

    if (existing.rows[0].role === 'supervisor') {
      const assigned = await db.query('SELECT COUNT(*) AS count FROM assignments WHERE supervisor_id = ?', [req.params.id]);
      const assignmentCount = parseInt(assigned.rows[0].count, 10);
      if (assignmentCount > 0 && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only an admin may delete a supervisor with assigned students' });
      }
    }

    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

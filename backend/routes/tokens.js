const express = require('express');
const crypto = require('crypto');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// Generate a new registration token
router.post('/generate', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { role = 'student', expiresInHours = 48 } = req.body;
    // Generate readable 8-char uppercase token
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    const expires = new Date(Date.now() + expiresInHours * 3600000);

    await db.insert(
      'INSERT INTO registration_tokens (token, role, created_by, expires_at) VALUES (?, ?, ?, ?)',
      [token, role, req.user.id, expires]
    );
    res.status(201).json({ token, role, expires_at: expires, message: 'Token generated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tokens
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, CONCAT(u.first_name,' ',u.last_name) AS created_by_name,
        CONCAT(ub.first_name,' ',ub.last_name) AS used_by_name
      FROM registration_tokens t
      JOIN users u ON t.created_by = u.id
      LEFT JOIN users ub ON t.used_by = ub.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate a token (public - used during registration)
router.get('/validate/:token', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, token, role, used, expires_at FROM registration_tokens WHERE token = ?',
      [req.params.token.toUpperCase()]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invalid token', valid: false });
    const t = result.rows[0];
    if (t.used) return res.status(400).json({ error: 'Token already used', valid: false });
    if (t.expires_at && new Date(t.expires_at) < new Date()) return res.status(400).json({ error: 'Token expired', valid: false });
    res.json({ valid: true, role: t.role, token: t.token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a token
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM registration_tokens WHERE id = ?', [req.params.id]);
    res.json({ message: 'Token deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

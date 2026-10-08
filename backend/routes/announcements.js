const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// Create announcement
router.post('/', authMiddleware, roleMiddleware('admin', 'coordinator'), async (req, res) => {
  try {
    const { title, message, targetRole = 'all' } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Title and message required' });
    const ins = await db.insert(
      'INSERT INTO announcements (title, message, created_by, target_role) VALUES (?, ?, ?, ?)',
      [title, message, req.user.id, targetRole]
    );
    const result = await db.query('SELECT * FROM announcements WHERE id = ?', [ins.insertId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get announcements for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const result = await db.query(`
      SELECT a.*,
        CONCAT(u.first_name,' ',u.last_name) AS created_by_name,
        (SELECT COUNT(*) FROM announcement_reads WHERE announcement_id = a.id AND user_id = ?) AS is_read
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      WHERE a.is_active = true
        AND (a.target_role = 'all' OR a.target_role = ?)
      ORDER BY a.created_at DESC
    `, [userId, role]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const result = await db.query(`
      SELECT COUNT(*) AS count FROM announcements a
      WHERE a.is_active = true
        AND (a.target_role = 'all' OR a.target_role = ?)
        AND a.id NOT IN (SELECT announcement_id FROM announcement_reads WHERE user_id = ?)
    `, [role, userId]);
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark announcement as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    await db.insert(
      'INSERT INTO announcement_reads (announcement_id, user_id) VALUES (?, ?) ON CONFLICT (announcement_id, user_id) DO NOTHING',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete announcement (soft delete)
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'coordinator'), async (req, res) => {
  try {
    await db.query('UPDATE announcements SET is_active = false WHERE id = ?', [req.params.id]);
    res.json({ message: 'Announcement removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

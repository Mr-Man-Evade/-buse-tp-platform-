const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Add feedback to document
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { documentId, comment, rating } = req.body;
    const reviewerId = req.user.id;
    const ins = await db.insert(
      'INSERT INTO feedback (document_id, reviewer_id, comment, rating) VALUES (?, ?, ?, ?)',
      [documentId, reviewerId, comment, rating]
    );
    const result = await db.query('SELECT * FROM feedback WHERE id = ?', [ins.insertId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get feedback for document
router.get('/document/:documentId', authMiddleware, async (req, res) => {
  try {
    const { documentId } = req.params;
    const result = await db.query(
      'SELECT f.*, u.first_name, u.last_name FROM feedback f JOIN users u ON f.reviewer_id = u.id WHERE f.document_id = ? ORDER BY f.created_at DESC',
      [documentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

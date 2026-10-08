const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// Overall statistics
router.get('/stats', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const [docs, users, pending, approved, rejected, byRole] = await Promise.all([
      db.query('SELECT COUNT(*) AS count FROM documents'),
      db.query('SELECT COUNT(*) AS count FROM users'),
      db.query("SELECT COUNT(*) AS count FROM documents WHERE status = 'pending'"),
      db.query("SELECT COUNT(*) AS count FROM documents WHERE status = 'approved'"),
      db.query("SELECT COUNT(*) AS count FROM documents WHERE status = 'rejected'"),
      db.query('SELECT role, COUNT(*) AS count FROM users GROUP BY role')
    ]);

    res.json({
      totalDocuments: docs.rows[0].count,
      totalUsers: users.rows[0].count,
      pendingDocuments: pending.rows[0].count,
      approvedDocuments: approved.rows[0].count,
      rejectedDocuments: rejected.rows[0].count,
      usersByRole: byRole.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User progress report
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(`
      SELECT
        u.first_name, u.last_name, u.email, u.role,
        COUNT(d.id) AS total_documents,
        SUM(CASE WHEN d.status = 'approved' THEN 1 ELSE 0 END) AS approved_documents,
        SUM(CASE WHEN d.status = 'pending' THEN 1 ELSE 0 END) AS pending_documents,
        SUM(CASE WHEN d.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_documents,
        ROUND(AVG(f.rating), 2) AS average_rating
      FROM users u
      LEFT JOIN documents d ON u.id = d.user_id
      LEFT JOIN feedback f ON d.id = f.document_id
      WHERE u.id = ?
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.role
    `, [userId]);
    res.json(result.rows[0] || { error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All students report
router.get('/students', authMiddleware, roleMiddleware('coordinator', 'admin', 'supervisor'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        u.id, u.first_name, u.last_name, u.email, u.student_id,
        COUNT(d.id) AS total_documents,
        SUM(CASE WHEN d.status = 'approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN d.status = 'pending' THEN 1 ELSE 0 END) AS pending,
        ROUND(AVG(f.rating), 2) AS avg_rating
      FROM users u
      LEFT JOIN documents d ON u.id = d.user_id
      LEFT JOIN feedback f ON d.id = f.document_id
      WHERE u.role = 'student'
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.student_id
      ORDER BY u.last_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

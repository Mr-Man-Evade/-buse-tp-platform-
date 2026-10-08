const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

async function resolveStudentId(input) {
  if (input === undefined || input === null) return null;
  const raw = String(input).trim();
  if (!raw) return null;

  const numeric = Number(raw);
  if (!Number.isNaN(numeric) && String(numeric) === raw) {
    const byId = await db.query('SELECT id FROM users WHERE id = ?', [numeric]);
    if (byId.rows.length > 0) return numeric;
  }

  const byReg = await db.query('SELECT id FROM users WHERE student_id = ? LIMIT 1', [raw.toUpperCase()]);
  return byReg.rows.length > 0 ? byReg.rows[0].id : null;
}

// Create or update assignment
router.post('/', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const { studentId, mentorId, supervisorId, school } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const resolvedStudentId = await resolveStudentId(studentId);
    if (!resolvedStudentId) return res.status(404).json({ error: 'Student not found' });

    // Check student exists and is a student
    const student = await db.query('SELECT id, role FROM users WHERE id = ? AND role = ?', [resolvedStudentId, 'student']);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    // Upsert assignment
    const existing = await db.query('SELECT id FROM assignments WHERE student_id = ?', [resolvedStudentId]);
    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE assignments SET mentor_id = ?, supervisor_id = ?, school = ?, assigned_by = ? WHERE student_id = ?',
        [mentorId || null, supervisorId || null, school || null, req.user.id, resolvedStudentId]
      );
    } else {
      await db.insert(
        'INSERT INTO assignments (student_id, mentor_id, supervisor_id, school, assigned_by) VALUES (?, ?, ?, ?, ?)',
        [resolvedStudentId, mentorId || null, supervisorId || null, school || null, req.user.id]
      );
    }

    const result = await db.query(`
      SELECT a.*,
        CONCAT(s.first_name,' ',s.last_name) AS student_name,
        CONCAT(m.first_name,' ',m.last_name) AS mentor_name,
        CONCAT(sv.first_name,' ',sv.last_name) AS supervisor_name
      FROM assignments a
      JOIN users s ON a.student_id = s.id
      LEFT JOIN users m ON a.mentor_id = m.id
      LEFT JOIN users sv ON a.supervisor_id = sv.id
      WHERE a.student_id = ?
    `, [resolvedStudentId]);

    res.json({ message: 'Assignment saved', assignment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all assignments
router.get('/', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*,
        CONCAT(s.first_name,' ',s.last_name) AS student_name, s.email AS student_email, s.student_id AS student_reg_id,
        CONCAT(m.first_name,' ',m.last_name) AS mentor_name, m.email AS mentor_email,
        CONCAT(sv.first_name,' ',sv.last_name) AS supervisor_name, sv.email AS supervisor_email
      FROM assignments a
      JOIN users s ON a.student_id = s.id
      LEFT JOIN users m ON a.mentor_id = m.id
      LEFT JOIN users sv ON a.supervisor_id = sv.id
      ORDER BY s.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk assignment upload
router.post('/bulk', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const { assignments } = req.body;
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ error: 'Assignments array is required' });
    }

    const results = [];
    for (const row of assignments) {
      const { studentId, mentorId, supervisorId, school } = row;
      if (!studentId) continue;
      const resolvedStudentId = await resolveStudentId(studentId);
      if (!resolvedStudentId) continue;
      const student = await db.query('SELECT id FROM users WHERE id = ? AND role = ?', [resolvedStudentId, 'student']);
      if (student.rows.length === 0) continue;

      const existing = await db.query('SELECT id FROM assignments WHERE student_id = ?', [resolvedStudentId]);
      if (existing.rows.length > 0) {
        await db.query('UPDATE assignments SET mentor_id = ?, supervisor_id = ?, school = ?, assigned_by = ? WHERE student_id = ?', [mentorId || null, supervisorId || null, school || null, req.user.id, resolvedStudentId]);
      } else {
        await db.insert('INSERT INTO assignments (student_id, mentor_id, supervisor_id, school, assigned_by) VALUES (?, ?, ?, ?, ?)', [resolvedStudentId, mentorId || null, supervisorId || null, school || null, req.user.id]);
      }
      results.push({ studentId: resolvedStudentId, mentorId, supervisorId, school });
    }

    res.json({ message: 'Bulk assignment upload processed', processed: results.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unassigned students
router.get('/unassigned-students', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, email, first_name, last_name, student_id, school FROM users
      WHERE role = 'student' AND id NOT IN (SELECT student_id FROM assignments)
      ORDER BY first_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get MY assigned students (mentor or supervisor)
router.get('/my-students', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let sql = '';
    if (role === 'mentor') {
      sql = `SELECT a.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, s.email, s.student_id AS reg_id, s.profile_picture
             FROM assignments a JOIN users s ON a.student_id = s.id WHERE a.mentor_id = ? ORDER BY s.first_name`;
    } else if (role === 'supervisor') {
      sql = `SELECT a.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, s.email, s.student_id AS reg_id, s.profile_picture
             FROM assignments a JOIN users s ON a.student_id = s.id WHERE a.supervisor_id = ? ORDER BY s.first_name`;
    } else {
      return res.status(403).json({ error: 'Only mentors and supervisors can use this endpoint' });
    }
    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get MY assignment (student: who is my mentor/supervisor)
router.get('/my-assignment', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*,
        CONCAT(m.first_name,' ',m.last_name) AS mentor_name, m.email AS mentor_email, m.profile_picture AS mentor_picture,
        CONCAT(sv.first_name,' ',sv.last_name) AS supervisor_name, sv.email AS supervisor_email, sv.profile_picture AS supervisor_picture
      FROM assignments a
      LEFT JOIN users m ON a.mentor_id = m.id
      LEFT JOIN users sv ON a.supervisor_id = sv.id
      WHERE a.student_id = ?
    `, [req.user.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete assignment
router.delete('/:id', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM assignments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Assignment removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

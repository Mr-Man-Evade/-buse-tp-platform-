const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const FORM_TYPES = {
  'lesson-observation': { label: 'Lesson Observation', submitRoles: ['mentor'] },
  'test-supervision': { label: 'Test Supervision and Assessment', submitRoles: ['supervisor'] },
  'document-assessment': { label: 'Assessment of Documents', submitRoles: ['supervisor'] }
};

const FORM_STATUSES = new Set(['draft', 'submitted', 'locked']);

function buildFormSummary(form) {
  const formTypeLabel = FORM_TYPES[form.form_type]?.label || 'Assessment Form';
  const statusLabel = {
    draft: 'Draft',
    submitted: 'Submitted',
    locked: 'Locked'
  }[form.status] || 'Submitted';

  const updatedAt = form.updated_at ? new Date(form.updated_at).toISOString().split('T')[0] : '';

  return {
    formTypeLabel,
    statusLabel,
    updatedAt
  };
}

function canSubmitForm(role, formType) {
  return FORM_TYPES[formType]?.submitRoles?.includes(role) || false;
}

function canManageForm(role) {
  return ['mentor', 'supervisor', 'coordinator', 'admin'].includes(role);
}

function normalizeStatus(status) {
  const nextStatus = String(status || '').trim().toLowerCase();
  return FORM_STATUSES.has(nextStatus) ? nextStatus : 'submitted';
}

async function ensureAccess(req, studentId) {
  const { role, id } = req.user;
  if (!studentId) return false;

  if (role === 'student') {
    return Number(studentId) === Number(id);
  }

  if (role === 'mentor') {
    const result = await db.query('SELECT id FROM assignments WHERE student_id = ? AND mentor_id = ?', [studentId, id]);
    return result.rows.length > 0;
  }

  if (role === 'supervisor') {
    const result = await db.query('SELECT id FROM assignments WHERE student_id = ? AND supervisor_id = ?', [studentId, id]);
    return result.rows.length > 0;
  }

  if (role === 'coordinator' || role === 'admin') {
    return true;
  }

  return false;
}

router.get('/reviewer-students', authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;
    let sql = '';
    let params = [];

    if (role === 'mentor') {
      sql = `SELECT a.student_id AS id, CONCAT(s.first_name, ' ', s.last_name) AS name, s.student_id, s.school, s.program, s.level, s.class_name, s.teaching_subject, s.tp_start_date, s.tp_end_date, s.topic
        FROM assignments a
        JOIN users s ON a.student_id = s.id
        WHERE a.mentor_id = ?
        ORDER BY s.first_name`;
      params = [id];
    } else if (role === 'supervisor') {
      sql = `SELECT a.student_id AS id, CONCAT(s.first_name, ' ', s.last_name) AS name, s.student_id, s.school, s.program, s.level, s.class_name, s.teaching_subject, s.tp_start_date, s.tp_end_date, s.topic
        FROM assignments a
        JOIN users s ON a.student_id = s.id
        WHERE a.supervisor_id = ?
        ORDER BY s.first_name`;
      params = [id];
    } else if (role === 'coordinator' || role === 'admin') {
      sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name, student_id, school, program, level, class_name, teaching_subject, tp_start_date, tp_end_date, topic
        FROM users
        WHERE role = 'student'
        ORDER BY first_name`;
    } else {
      return res.status(403).json({ error: 'Only students, mentors, supervisors and coordinators can view assessment forms' });
    }

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-forms', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM assessment_forms WHERE student_id = ? ORDER BY form_type, updated_at DESC',
      [req.user.id]
    );

    const rows = req.user.role === 'student'
      ? result.rows.filter((row) => row.status !== 'draft')
      : result.rows;

    res.json(rows.map((row) => ({
      ...row,
      formData: row.form_data ? JSON.parse(row.form_data) : {},
      summary: buildFormSummary(row)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:studentId/:formType', authMiddleware, async (req, res) => {
  try {
    const { studentId, formType } = req.params;
    if (!FORM_TYPES[formType]) {
      return res.status(400).json({ error: 'Unsupported form type' });
    }

    const accessAllowed = await ensureAccess(req, studentId);
    if (!accessAllowed) {
      return res.status(403).json({ error: 'You are not assigned to review this student' });
    }

    const result = await db.query(
      'SELECT * FROM assessment_forms WHERE student_id = ? AND form_type = ? ORDER BY updated_at DESC LIMIT 1',
      [studentId, formType]
    );

    if (result.rows.length === 0) {
      return res.json({
        studentId,
        formType,
        formData: {},
        status: 'draft',
        summary: buildFormSummary({ form_type: formType, status: 'draft', updated_at: null })
      });
    }

    const row = result.rows[0];
    if (req.user.role === 'student' && row.status === 'draft') {
      return res.status(404).json({ error: 'Assessment form has not been published yet' });
    }

    res.json({
      ...row,
      formData: row.form_data ? JSON.parse(row.form_data) : {},
      summary: buildFormSummary(row)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:studentId/:formType', authMiddleware, async (req, res) => {
  try {
    const { studentId, formType } = req.params;
    const { formData, status } = req.body;

    if (!FORM_TYPES[formType]) {
      return res.status(400).json({ error: 'Unsupported form type' });
    }

    if (!canSubmitForm(req.user.role, formType)) {
      return res.status(403).json({ error: 'This role cannot submit this assessment form' });
    }

    if (!canManageForm(req.user.role)) {
      return res.status(403).json({ error: 'You are not allowed to manage assessment forms' });
    }

    const accessAllowed = await ensureAccess(req, studentId);
    if (!accessAllowed) {
      return res.status(403).json({ error: 'You are not assigned to review this student' });
    }

    const nextStatus = normalizeStatus(status);
    const payload = {
      ...(formData || {}),
      submittedAt: new Date().toISOString(),
      reviewerRole: req.user.role,
      reviewerId: req.user.id,
      reviewerName: `${req.user.email}`,
      formStatus: nextStatus
    };

    const serialized = JSON.stringify(payload);
    const existing = await db.query('SELECT id FROM assessment_forms WHERE student_id = ? AND form_type = ?', [studentId, formType]);

    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE assessment_forms SET form_data = ?, reviewer_role = ?, reviewer_id = ?, status = ?, updated_at = NOW() WHERE student_id = ? AND form_type = ?',
        [serialized, req.user.role, req.user.id, nextStatus, studentId, formType]
      );
    } else {
      await db.insert(
        'INSERT INTO assessment_forms (student_id, reviewer_id, reviewer_role, form_type, form_data, status) VALUES (?, ?, ?, ?, ?, ?)',
        [studentId, req.user.id, req.user.role, formType, serialized, nextStatus]
      );
    }

    res.json({ message: nextStatus === 'draft' ? 'Assessment form saved as draft' : 'Assessment form published', formType, status: nextStatus, formData: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:studentId/:formType', authMiddleware, async (req, res) => {
  try {
    const { studentId, formType } = req.params;

    if (!FORM_TYPES[formType]) {
      return res.status(400).json({ error: 'Unsupported form type' });
    }

    const accessAllowed = await ensureAccess(req, studentId);
    if (!accessAllowed) {
      return res.status(403).json({ error: 'You are not assigned to review this student' });
    }

    const existing = await db.query(
      'SELECT * FROM assessment_forms WHERE student_id = ? AND form_type = ? ORDER BY updated_at DESC LIMIT 1',
      [studentId, formType]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment form not found' });
    }

    const form = existing.rows[0];
    const isCreator = Number(form.reviewer_id) === Number(req.user.id);
    const isPrivileged = ['coordinator', 'admin'].includes(req.user.role);

    if (!isPrivileged && !isCreator) {
      return res.status(403).json({ error: 'You can only delete forms you created' });
    }

    if (form.status !== 'draft' && !isPrivileged) {
      return res.status(403).json({ error: 'Only draft forms can be deleted by the reviewer' });
    }

    await db.query('DELETE FROM assessment_forms WHERE id = ?', [form.id]);
    res.json({ message: 'Assessment form deleted', formType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, buildFormSummary, canSubmitForm };

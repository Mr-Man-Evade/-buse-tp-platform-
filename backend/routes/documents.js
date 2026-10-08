const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

function toPublicPath(filePath) {
  if (!filePath) return filePath;
  if (filePath.startsWith('/')) return filePath;
  return `/${filePath.replace(/^\.\//, '')}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4', 'image/jpeg', 'image/png'
  ];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

// Upload documents
router.post('/upload', authMiddleware, upload.array('files'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, description, submissionType, dueDate, studentRegNumber, program, level } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      const finalCategory = category || submissionType || 'general';
      const ins = await db.insert(
        'INSERT INTO documents (user_id, title, file_name, file_path, file_type, file_size, category, status, description, submission_type, due_date, student_reg_number, program, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, title || file.originalname, file.originalname, file.path, file.mimetype, file.size, finalCategory, 'pending', description || '', finalCategory, dueDate || null, studentRegNumber || null, program || null, level || null]
      );
      const result = await db.query('SELECT * FROM documents WHERE id = ?', [ins.insertId]);
      uploadedFiles.push(result.rows[0]);
    }

    res.status(201).json({ message: 'Files uploaded successfully', documents: uploadedFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's own documents (with optional status/category filter)
router.get('/my-documents', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category } = req.query;
    let sql = 'SELECT * FROM documents WHERE user_id = ?';
    const params = [userId];

    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (category) { sql += ' AND category = ?'; params.push(category); }
    sql += ' ORDER BY created_at DESC';

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all documents (supervisors/coordinators/mentors)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, category, userId: filterUser } = req.query;
    const { role, id: userId } = req.user;

    let sql = 'SELECT d.*, u.first_name, u.last_name, u.email FROM documents d JOIN users u ON d.user_id = u.id WHERE 1=1';
    const params = [];

    // Mentors and supervisors only see their assigned students' documents
    if (role === 'mentor') {
      sql += ' AND d.user_id IN (SELECT student_id FROM assignments WHERE mentor_id = ?)';
      params.push(userId);
    } else if (role === 'supervisor') {
      sql += ' AND d.user_id IN (SELECT student_id FROM assignments WHERE supervisor_id = ?)';
      params.push(userId);
    }

    if (status) { sql += ' AND d.status = ?'; params.push(status); }
    if (category) { sql += ' AND d.category = ?'; params.push(category); }
    if (filterUser) { sql += ' AND d.user_id = ?'; params.push(filterUser); }
    sql += ' ORDER BY d.created_at DESC';

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single document by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT d.*, u.first_name, u.last_name FROM documents d JOIN users u ON d.user_id = u.id WHERE d.id = ?',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update document status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, grade, supervisorComment } = req.body;
    const updates = [];
    const values = [];

    if (typeof status !== 'undefined') {
      updates.push('status = ?');
      values.push(status);
    }
    if (typeof grade !== 'undefined') {
      updates.push('final_grade = ?');
      values.push(grade);
    }
    if (typeof supervisorComment !== 'undefined') {
      updates.push('supervisor_comment = ?');
      values.push(supervisorComment);
    }

    if (updates.length > 0) {
      if (status === 'approved' || status === 'reviewed') {
        updates.push('reviewed_at = NOW()');
      }
      await db.query(`UPDATE documents SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);
    }

    const result = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track document download
router.post('/:id/download', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE documents SET download_count = download_count + 1 WHERE id = ?', [id]);
    const result = await db.query('SELECT file_path, file_name FROM documents WHERE id = ?', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    res.json({ filePath: toPublicPath(result.rows[0].file_path), fileName: result.rows[0].file_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/download-zip/:studentId', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { role, id: userId } = req.user;

    if (role === 'supervisor') {
      const assigned = await db.query('SELECT id FROM assignments WHERE student_id = ? AND supervisor_id = ?', [studentId, userId]);
      if (assigned.rows.length === 0) return res.status(403).json({ error: 'Unauthorized' });
    }

    if (role === 'mentor') {
      const assigned = await db.query('SELECT id FROM assignments WHERE student_id = ? AND mentor_id = ?', [studentId, userId]);
      if (assigned.rows.length === 0) return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await db.query('SELECT file_path, file_name FROM documents WHERE user_id = ?', [studentId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No documents found for this student' });

    const archive = archiver('zip', { zlib: { level: 9 } });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="student-${studentId}-submissions.zip"`);

    archive.on('error', (err) => { throw err; });
    archive.pipe(res);

    result.rows.forEach((doc) => {
      if (fs.existsSync(doc.file_path)) {
        archive.file(doc.file_path, { name: doc.file_name });
      }
    });

    archive.finalize();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete document (owner or coordinator/admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });

    const doc = result.rows[0];
    const isOwner = doc.user_id === req.user.id;
    const isPrivileged = ['coordinator', 'admin'].includes(req.user.role);

    if (!isOwner && !isPrivileged) return res.status(403).json({ error: 'Unauthorized' });

    // Delete physical file
    if (fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path);
    }
    await db.query('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

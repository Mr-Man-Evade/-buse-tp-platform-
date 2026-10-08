const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'messages');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`);
  }
});
const upload = multer({ storage });

// Get contacts (all users except current)
router.get('/contacts', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id != ? ORDER BY first_name',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get conversation
router.get('/conversation/:contactId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = Number(req.params.contactId);
    if (!contactId) return res.status(400).json({ error: 'Invalid contact ID' });

    const msgs = await db.query(
      `SELECT id, sender_id, recipient_id, content, is_read, created_at
       FROM messages
       WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
       ORDER BY created_at ASC`,
      [userId, contactId, contactId, userId]
    );

    // Fetch attachments per message
    const messages = await Promise.all(msgs.rows.map(async (msg) => {
      const atts = await db.query(
        'SELECT id, file_name, file_path, file_url, file_type, file_size, created_at FROM message_attachments WHERE message_id = ?',
        [msg.id]
      );
      return { ...msg, attachments: atts.rows };
    }));

    // Mark messages as read
    await db.query(
      'UPDATE messages SET is_read = true WHERE recipient_id = ? AND sender_id = ?',
      [userId, contactId]
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post('/', authMiddleware, upload.array('attachments'), async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, content } = req.body;
    if (!recipientId || (!content?.trim() && (!req.files || req.files.length === 0))) {
      return res.status(400).json({ error: 'Recipient and message or attachment required' });
    }

    const ins = await db.insert(
      'INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)',
      [senderId, recipientId, content?.trim() || '']
    );
    const msgResult = await db.query('SELECT * FROM messages WHERE id = ?', [ins.insertId]);
    const message = { ...msgResult.rows[0], attachments: [] };

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/messages/${file.filename}`;
        const attIns = await db.insert(
          'INSERT INTO message_attachments (message_id, file_name, file_path, file_url, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)',
          [message.id, file.originalname, `uploads/messages/${file.filename}`, fileUrl, file.mimetype, file.size]
        );
        const att = await db.query('SELECT * FROM message_attachments WHERE id = ?', [attIns.insertId]);
        message.attachments.push(att.rows[0]);
      }
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unread message count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) AS count FROM messages WHERE recipient_id = ? AND is_read = false',
      [req.user.id]
    );
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    result.rows.forEach(r => settings[r.setting_key] = r.setting_value);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a setting (admin only)
router.put('/:key', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { value } = req.body;
    await db.query(
      'INSERT INTO system_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_by = EXCLUDED.updated_by, updated_at = NOW()',
      [req.params.key, value, req.user.id]
    );
    res.json({ key: req.params.key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

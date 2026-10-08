const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./config/database');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

['uploads','uploads/messages','uploads/profiles'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Import Routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const userRoutes = require('./routes/users');
const feedbackRoutes = require('./routes/feedback');
const reportsRoutes = require('./routes/reports');
const messageRoutes = require('./routes/messages');
const assignmentRoutes = require('./routes/assignments');
const finalMarksRoutes = require('./routes/finalMarks');
const tokenRoutes = require('./routes/tokens');
const settingsRoutes = require('./routes/settings');
const announcementRoutes = require('./routes/announcements');
const assessmentFormsRoutes = require('./routes/assessmentForms').router;

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/final-marks', finalMarksRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assessment-forms', assessmentFormsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));

const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Add demo users
    const users = [
      { email: 'student2@buse.edu.zw', password: 'studentpass', first: 'Student', last: 'Two', role: 'student', studentId: 'STU002' },
      { email: 'mentor1@buse.edu.zw', password: 'mentorpass', first: 'Mentor', last: 'One', role: 'mentor' },
      { email: 'supervisor1@buse.edu.zw', password: 'supervisorpass', first: 'Supervisor', last: 'One', role: 'supervisor' },
      { email: 'coordinator1@buse.edu.zw', password: 'coordinatorpass', first: 'Coordinator', last: 'One', role: 'coordinator' }
    ];

    for (const u of users) {
      const exists = await db.query('SELECT id FROM users WHERE email = ?', [u.email]);
      if (exists.rows.length === 0) {
        const hash = await bcrypt.hash(u.password, 10);
        await db.insert(
          'INSERT INTO users (email, password, first_name, last_name, role, student_id) VALUES (?, ?, ?, ?, ?, ?)',
          [u.email, hash, u.first, u.last, u.role, u.studentId || null]
        );
        console.log('Inserted user', u.email);
      } else {
        console.log('User exists', u.email);
      }
    }

    // Add announcement
    const ann = await db.query('SELECT id FROM announcements WHERE title = ?', ['Seeded announcement']);
    if (ann.rows.length === 0) {
      await db.insert('INSERT INTO announcements (title, message, created_by, target_role) VALUES (?, ?, ?, ?)', ['Seeded announcement', 'This is a seeded announcement for testing.', 1, 'all']);
      console.log('Inserted announcement');
    }

    // Add document for student2
    const student = await db.query('SELECT id FROM users WHERE email = ?', ['student2@buse.edu.zw']);
    if (student.rows.length > 0) {
      const sid = student.rows[0].id;
      await db.insert('INSERT INTO documents (user_id, title, file_name, file_path, file_type, file_size, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [sid, 'Test Doc', 'test.pdf', 'uploads/documents/test.pdf', 'application/pdf', 12345, 'general', 'pending']);
      console.log('Inserted document for student2');
    }

    // Create assignment linking student2 to mentor1 and supervisor1
    const mentor = await db.query('SELECT id FROM users WHERE email = ?', ['mentor1@buse.edu.zw']);
    const supervisor = await db.query('SELECT id FROM users WHERE email = ?', ['supervisor1@buse.edu.zw']);
    if (student.rows.length > 0 && mentor.rows.length > 0) {
      const sid = student.rows[0].id;
      const mid = mentor.rows[0].id;
      const spid = supervisor.rows.length > 0 ? supervisor.rows[0].id : null;
      const exists = await db.query('SELECT id FROM assignments WHERE student_id = ?', [sid]);
      if (exists.rows.length === 0) {
        await db.insert(
          'INSERT INTO assignments (student_id, mentor_id, supervisor_id, school, assigned_by) VALUES (?, ?, ?, ?, ?)',
          [sid, mid, spid, 'Test School', 1]
        );
        console.log('Inserted assignment linking student2 to mentor1 and supervisor1');
      } else console.log('Assignment already exists');
    }

    // Create a sample message thread
    if (mentor.rows.length > 0) {
      const mid = mentor.rows[0].id;
      await db.insert('INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)', [1, mid, 'Hello mentor, this is a seeded message.']);
      console.log('Inserted message to mentor1');
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();

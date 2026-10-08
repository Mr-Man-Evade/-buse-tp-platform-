const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'buse_tp',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

function convertPlaceholders(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      student_id VARCHAR(50),
      phone VARCHAR(20),
      school VARCHAR(255),
      is_active BOOLEAN DEFAULT TRUE,
      reset_token VARCHAR(255),
      reset_token_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      profile_picture VARCHAR(500),
      title VARCHAR(20),
      program VARCHAR(255),
      level VARCHAR(20),
      class_name VARCHAR(100),
      teaching_subject VARCHAR(255),
      topic VARCHAR(255),
      tp_start_date DATE,
      tp_end_date DATE,
      CONSTRAINT chk_role CHECK (role IN ('student','mentor','supervisor','coordinator','admin'))
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255),
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(512) NOT NULL,
      file_type VARCHAR(100),
      file_size BIGINT,
      category VARCHAR(100) DEFAULT 'general',
      download_count INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      submission_type VARCHAR(100),
      description TEXT,
      due_date DATE,
      final_grade VARCHAR(20),
      supervisor_comment TEXT,
      reviewed_at TIMESTAMPTZ,
      student_reg_number VARCHAR(50),
      program VARCHAR(255),
      level VARCHAR(20),
      CONSTRAINT chk_status CHECK (status IN ('pending','approved','rejected','reviewed'))
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      reviewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT,
      rating INT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      action VARCHAR(255) NOT NULL,
      entity_type VARCHAR(100),
      entity_id INT,
      old_values JSONB,
      new_values JSONB,
      ip_address VARCHAR(45),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS scheduled_visits (
      id SERIAL PRIMARY KEY,
      supervisor_id INT NOT NULL REFERENCES users(id),
      student_id INT NOT NULL REFERENCES users(id),
      visit_date TIMESTAMPTZ NOT NULL,
      location VARCHAR(255),
      purpose TEXT,
      status VARCHAR(50) DEFAULT 'scheduled',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      reply_to INT REFERENCES messages(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS message_attachments (
      id SERIAL PRIMARY KEY,
      message_id INT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(512) NOT NULL,
      file_url VARCHAR(1024) NOT NULL,
      file_type VARCHAR(100),
      file_size BIGINT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      mentor_id INT REFERENCES users(id) ON DELETE SET NULL,
      supervisor_id INT REFERENCES users(id) ON DELETE SET NULL,
      school VARCHAR(255),
      assigned_by INT NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registration_tokens (
      id SERIAL PRIMARY KEY,
      token VARCHAR(20) NOT NULL UNIQUE,
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      used BOOLEAN DEFAULT FALSE,
      used_by INT,
      created_by INT NOT NULL REFERENCES users(id),
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id SERIAL PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      updated_by INT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_role VARCHAR(50) DEFAULT 'all',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS announcement_reads (
      id SERIAL PRIMARY KEY,
      announcement_id INT NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      read_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT unique_read UNIQUE (announcement_id, user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS final_marks (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      supervisor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      programme VARCHAR(255),
      tp_school_name VARCHAR(255),
      tp_date DATE,
      tp_duration_from DATE,
      tp_duration_to DATE,
      subject_teaching VARCHAR(255),
      classes VARCHAR(255),
      lesson_intro INT,
      lesson_objectives INT,
      lesson_sequencing INT,
      lesson_teacher_activities INT,
      lesson_pupils_experiences INT,
      lesson_strategies INT,
      lesson_media INT,
      lesson_format_frequency INT,
      scheming_aims INT,
      scheming_content INT,
      scheming_methods INT,
      scheming_resources INT,
      scheming_references INT,
      assessment_test_design INT,
      assessment_assignments INT,
      assessment_remedial INT,
      assessment_extension INT,
      assessment_profiles INT,
      assessment_records INT,
      reflective_depth_scope INT,
      reflective_attainment INT,
      reflective_weaknesses_strengths INT,
      reflective_suggestions INT,
      file_appearance_relevant_sections INT,
      total_marks INT,
      overall_comments TEXT,
      mark_awarded VARCHAR(50),
      assessor_name VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS grades (
      id SERIAL PRIMARY KEY,
      student_id INT REFERENCES users(id),
      supervisor_id INT REFERENCES users(id),
      preparation INT,
      professionalism INT,
      teaching INT,
      assessment INT,
      file_management INT,
      communication INT,
      total INT,
      comments TEXT,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assessment_forms (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL REFERENCES users(id),
      reviewer_id INT,
      reviewer_role VARCHAR(50),
      form_type VARCHAR(50) NOT NULL,
      form_data TEXT,
      status VARCHAR(20) DEFAULT 'draft',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT chk_assessment_form_status CHECK (status IN ('draft','submitted','locked'))
    )
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_feedback_document_id ON feedback(document_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_assessment_forms_student_type ON assessment_forms(student_id, form_type)`);
}

ensureSchema().catch((err) => console.warn('Schema ensure skipped:', err.message));

// Compatibility wrapper: returns { rows } like pg
const db = {
  query: async (sql, params = []) => {
    const result = await pool.query(convertPlaceholders(sql), params);
    return { rows: result.rows };
  },
  // For INSERT: returns insertId
  insert: async (sql, params = []) => {
    const trimmed = sql.trim().replace(/;$/, '');
    const queryText = /returning\s+/i.test(trimmed) ? trimmed : `${trimmed} RETURNING id`;
    const result = await pool.query(convertPlaceholders(queryText), params);
    return { insertId: result.rows[0]?.id ?? null, rows: result.rows };
  }
};

module.exports = db;
module.exports.ensureSchema = ensureSchema;
module.exports.pool = pool;

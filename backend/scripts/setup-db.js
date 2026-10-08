// PostgreSQL database setup script
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const targetDatabase = process.env.DB_NAME || 'buse_tp';
const maintenanceDatabase = process.env.DB_ADMIN_DATABASE || 'postgres';
const adminInitialPassword = process.env.ADMIN_INITIAL_PASSWORD;

async function createDatabaseIfMissing() {
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: maintenanceDatabase,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  await adminClient.connect();
  const result = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDatabase]);
  if (result.rowCount === 0) {
    await adminClient.query(`CREATE DATABASE ${targetDatabase}`);
    console.log(`✓ Database ${targetDatabase} created`);
  } else {
    console.log(`✓ Database ${targetDatabase} already exists`);
  }
  await adminClient.end();
}

async function seedAdmin() {
  const appClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: targetDatabase,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  await appClient.connect();
  const adminHash = await bcrypt.hash(adminInitialPassword, 10);
  await appClient.query(
    `INSERT INTO users (email, password, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role`,
    ['admin@buse.edu.zw', adminHash, 'System', 'Administrator', 'admin']
  );
  await appClient.query(
    `INSERT INTO system_settings (setting_key, setting_value)
     VALUES ($1, $2), ($3, $4)
     ON CONFLICT (setting_key) DO NOTHING`,
    ['self_register_enabled', '0', 'max_coordinators', '5']
  );
  console.log('✓ Admin user seeded (admin@buse.edu.zw)');
  await appClient.end();
}

async function setup() {
  if (!adminInitialPassword) {
    throw new Error('Set ADMIN_INITIAL_PASSWORD in backend/.env before setup.');
  }

  console.log('Starting PostgreSQL setup...');
  await createDatabaseIfMissing();

  // Create schema immediately so admin seeding always has required tables.
  const db = require('../config/database');
  await db.ensureSchema();

  await seedAdmin();
  console.log('✓ PostgreSQL setup complete');
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});

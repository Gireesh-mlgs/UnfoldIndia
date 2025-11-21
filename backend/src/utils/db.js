const { Pool } = require('pg');

let pool;

async function initDb() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/unfold'
  });

  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      session_id TEXT,
      message JSONB,
      created_at TIMESTAMP DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS safety_reports (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      lat NUMERIC,
      lng NUMERIC,
      description TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
  console.log('DB initialized');
}

function getPool() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getPool };

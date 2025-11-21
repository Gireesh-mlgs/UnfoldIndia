const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const pool = getPool();
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING id,email,role', [email, hash]);
    const user = r.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const pool = getPool();
  const r = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email=$1', [email]);
  const user = r.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

module.exports = router;

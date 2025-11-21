const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getPool } = require('../utils/db');

router.post('/report', authenticate, async (req, res) => {
  const { lat, lng, description } = req.body;
  const pool = getPool();
  const r = await pool.query('INSERT INTO safety_reports (user_id, lat, lng, description) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.userId, lat, lng, description]);
  res.json({ report: r.rows[0] });
});

router.get('/alerts', authenticate, async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  const pool = getPool();
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const r = await pool.query('SELECT * FROM safety_reports WHERE lat BETWEEN $1 AND $2 AND lng BETWEEN $3 AND $4 ORDER BY created_at DESC', [latNum - 0.05, latNum + 0.05, lngNum - 0.05, lngNum + 0.05]);
  res.json({ alerts: r.rows });
});

module.exports = router;

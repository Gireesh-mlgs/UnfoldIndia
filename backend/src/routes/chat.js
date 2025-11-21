const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const { getPool } = require('../utils/db');

// POST /v1/chat
router.post('/', authenticate, async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user.userId;
  const pool = getPool();

  await pool.query('INSERT INTO chats (user_id, session_id, message) VALUES ($1,$2,$3)', [userId, sessionId || null, { role: 'user', content: message }]);

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) throw new Error('Missing OPENAI_API_KEY');

    const resp = await axios.post('https://api.openai.com/v1/responses', {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: message
    }, {
      headers: { Authorization: `Bearer ${openaiKey}` }
    });

    const botText = (resp.data.output?.[0]?.content?.[0]?.text) || resp.data.output_text || JSON.stringify(resp.data);

    await pool.query('INSERT INTO chats (user_id, session_id, message) VALUES ($1,$2,$3)', [userId, sessionId || null, { role: 'assistant', content: botText }]);

    res.json({ reply: botText, raw: resp.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Chatbot error', detail: err.response?.data || err.message });
  }
});

router.get('/:sessionId/history', authenticate, async (req, res) => {
  const { sessionId } = req.params;
  const pool = getPool();
  const r = await pool.query('SELECT message, created_at FROM chats WHERE session_id=$1 ORDER BY created_at ASC', [sessionId]);
  res.json({ history: r.rows });
});

module.exports = router;

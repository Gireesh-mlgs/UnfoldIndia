const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');

// POST /v1/translate
router.post('/', authenticate, async (req, res) => {
  const { text, target = 'en', source = 'auto' } = req.body;

  try {
    if (process.env.USE_DEEPL === '1' && process.env.DEEPL_KEY) {
      const r = await axios.post(`https://api-free.deepl.com/v2/translate`, null, {
        params: { auth_key: process.env.DEEPL_KEY, text, target_lang: target.toUpperCase() }
      });
      const translated = r.data.translations[0].text;
      return res.json({ translatedText: translated, provider: 'deepl' });
    }

    if (process.env.GOOGLE_TRANSLATE_KEY) {
      const resp = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_KEY}`, {
        q: text,
        target: target,
        source: source === 'auto' ? undefined : source,
        format: 'text'
      });
      return res.json({ translatedText: resp.data.data.translations[0].translatedText, provider: 'google' });
    }

    if (process.env.LIBRE_URL) {
      const r = await axios.post(`${process.env.LIBRE_URL}/translate`, { q: text, source: source === 'auto' ? 'auto' : source, target });
      return res.json({ translatedText: r.data.translatedText, provider: 'libre' });
    }

    res.status(400).json({ error: 'No translation provider configured' });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Translation failed', detail: err.response?.data || err.message });
  }
});

module.exports = router;

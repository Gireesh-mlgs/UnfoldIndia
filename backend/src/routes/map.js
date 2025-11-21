const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const MAPBOX_BASE = 'https://api.mapbox.com';

router.get('/places/search', authenticate, async (req, res) => {
  const { query, proximity } = req.query;
  try {
    if (!MAPBOX_TOKEN) return res.status(500).json({ error: 'MAPBOX_TOKEN not configured' });
    const url = `${MAPBOX_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=6${proximity ? `&proximity=${proximity}` : ''}`;
    const r = await axios.get(url);
    res.json({ places: r.data.features });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Places search failed' });
  }
});

router.post('/routes', authenticate, async (req, res) => {
  const { origin, destination, profile = 'driving' } = req.body;
  try {
    if (!MAPBOX_TOKEN) return res.status(500).json({ error: 'MAPBOX_TOKEN not configured' });
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `${MAPBOX_BASE}/directions/v5/mapbox/${profile}/${coords}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    const r = await axios.get(url);
    res.json({ routes: r.data.routes });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Routing failed' });
  }
});

module.exports = router;

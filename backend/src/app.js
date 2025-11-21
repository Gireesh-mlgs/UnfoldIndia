require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const translateRoutes = require('./routes/translate');
const mapRoutes = require('./routes/map');
const safetyRoutes = require('./routes/safety');

const { initDb } = require('./utils/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/v1/auth', authRoutes);
app.use('/v1/chat', chatRoutes);
app.use('/v1/translate', translateRoutes);
app.use('/v1/maps', mapRoutes);
app.use('/v1/safety', safetyRoutes);

const PORT = process.env.PORT || 4000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Unfold India API listening on ${PORT}`));
}).catch(err => {
  console.error('DB init failed', err);
  process.exit(1);
});

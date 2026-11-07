/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const connectToDatabase = require('./models/db');

const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3060;

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Статические файлы (картинки предметов)
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static('public'));

connectToDatabase()
  .then(() => logger.info('Connected to DB'))
  .catch((e) => console.error('Failed to connect to DB', e));

// Маршруты
app.use('/api/secondchance/items', secondChanceItemsRoutes);
app.use('/api/secondchance/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.get('/', (req, res) => {
  res.send('Inside the server');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');
const multer = require('multer');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const directoryPath = 'public/images';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Получить все предметы
router.get('/', async (req, res, next) => {
  logger.info('/ called');
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const secondChanceItems = await collection.find({}).toArray();
    res.json(secondChanceItems);
  } catch (e) {
    logger.error('oops something went wrong', e);
    next(e);
  }
});

// Добавить предмет (с загрузкой файла)
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    let secondChanceItem = req.body;

    const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const lastId = lastItem.length > 0 ? parseInt(lastItem[0].id) : 0;
    secondChanceItem.id = (lastId + 1).toString();

    secondChanceItem.date_added = Math.floor(new Date().getTime() / 1000);

    await collection.insertOne(secondChanceItem);
    res.status(201).json(secondChanceItem);
  } catch (e) {
    next(e);
  }
});

// Получить предмет по id
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const id = req.params.id;
    const secondChanceItem = await collection.findOne({ id: id });

    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found');
    }
    res.json(secondChanceItem);
  } catch (e) {
    next(e);
  }
});

// Обновить предмет
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const id = req.params.id;
    const secondChanceItem = await collection.findOne({ id: id });

    if (!secondChanceItem) {
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    const updates = {
      category: req.body.category,
      condition: req.body.condition,
      age_days: req.body.age_days,
      description: req.body.description,
      updatedAt: new Date(),
    };
    updates.age_years = Number((updates.age_days / 365).toFixed(1));

    await collection.updateOne({ id: id }, { $set: updates });
    res.json({ uploaded: 'success' });
  } catch (e) {
    next(e);
  }
});

// Удалить предмет
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const id = req.params.id;
    const secondChanceItem = await collection.findOne({ id: id });

    if (!secondChanceItem) {
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    await collection.deleteOne({ id: id });
    res.json({ deleted: 'success' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
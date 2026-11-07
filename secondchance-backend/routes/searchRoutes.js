const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');

    let query = {};

    // Фильтр по названию
    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    // Фильтр по категории
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Фильтр по состоянию
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Фильтр по возрасту
    if (req.query.age_years) {
      query.age_years = { $lte: parseInt(req.query.age_years) };
    }

    const secondChanceItems = await collection.find(query).toArray();
    res.json(secondChanceItems);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const connectDB = require('../utils/mongodb');
const { authenticateUser } = require('../utils/middleware');

// GET /api/meals
router.get('/', authenticateUser, async (req, res) => {
  try {
    await connectDB();
    const { hallName, day, mealType } = req.query;
    let query = {};
    // If manager, restrict to their hall
    if (req.user && req.user.role === 'manager' && req.user.hallNo) {
      query.hallName = req.user.hallNo;
    } else {
      // For normal users, only show available meals
      query.available = true;
      if (hallName) query.hallName = hallName;
    }
    if (day) query.day = day.toLowerCase();
    if (mealType) query.mealType = mealType.toLowerCase();
    const meals = await Meal.find(query);
    return res.json(meals);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/meals/:id/availability - Mark meal as available/unavailable (manager only)
router.patch('/:id/availability', authenticateUser, async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (user.role !== 'manager' || !user.hallNo) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const meal = await Meal.findById(req.params.id);
    if (!meal || meal.hallName !== user.hallNo) {
      return res.status(404).json({ error: 'Meal not found for your hall' });
    }
    meal.available = req.body.available;
    await meal.save();
    res.json(meal);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/meals/:id/menu - Update menu items (manager only)
router.patch('/:id/menu', authenticateUser, async (req, res) => {
  try {
    await connectDB();
    const user = req.user;
    if (user.role !== 'manager' || !user.hallNo) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const meal = await Meal.findById(req.params.id);
    if (!meal || meal.hallName !== user.hallNo) {
      return res.status(404).json({ error: 'Meal not found for your hall' });
    }
    if (!Array.isArray(req.body.menuItems)) {
      return res.status(400).json({ error: 'menuItems must be an array' });
    }
    meal.menuItems = req.body.menuItems;
    await meal.save();
    res.json(meal);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
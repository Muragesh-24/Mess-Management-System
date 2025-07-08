const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

// Get all menus for a specific hall
router.get('/hall/:hallName', async (req, res) => {
  try {
    const { hallName } = req.params;
    const { month = 'July', year = 2025 } = req.query;

    const meals = await Meal.find({
      hallName: hallName,
      month: month,
      year: year
    }).sort({ day: 1, mealType: 1 });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu for specific hall, day, and meal type
router.get('/hall/:hallName/:day/:mealType', async (req, res) => {
  try {
    const { hallName, day, mealType } = req.params;
    const { month = 'July', year = 2025 } = req.query;

    const meal = await Meal.findOne({
      hallName,
      day: day.toLowerCase(),
      mealType: mealType.toLowerCase(),
      month,
      year
    });

    if (!meal) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all halls with their menus
router.get('/all-halls', async (req, res) => {
  try {
    const { month = 'July', year = 2025 } = req.query;

    const meals = await Meal.find({ month, year })
      .sort({ hallName: 1, day: 1, mealType: 1 });

    // Group by hall
    const groupedByHall = meals.reduce((acc, meal) => {
      if (!acc[meal.hallName]) {
        acc[meal.hallName] = [];
      }
      acc[meal.hallName].push(meal);
      return acc;
    }, {});

    res.json(groupedByHall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new menu item
router.post('/add', async (req, res) => {
  try {
    const meal = new Meal(req.body);
    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update menu
router.put('/update/:id', async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(updatedMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Seed menu data endpoint
router.post('/seed', async (req, res) => {
  try {
    const { seedMenuData } = require('../utils/seedMenuData');
    await seedMenuData();
    res.json({ message: 'Menu data seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
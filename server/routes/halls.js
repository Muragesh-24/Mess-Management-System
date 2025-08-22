const express = require('express');
const router = express.Router();
const Hall = require('../models/Hall');

const { authenticateUser } = require('../utils/middleware');

// GET /api/halls
router.get('/', authenticateUser, async (req, res) => {
  try {

    const halls = await Hall.find({ status: 'active' });
    return res.json(halls);
  } catch (error) {
    console.error('Error fetching halls:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
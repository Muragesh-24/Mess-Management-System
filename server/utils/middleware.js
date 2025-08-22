// import { NextRequest } from 'next/server';
const { verifyToken } = require('./auth');

const User = require('../models/User');
const Admin = require('../models/Admin');

async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers.get?.('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    let user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      user = await Admin.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { authenticateUser };
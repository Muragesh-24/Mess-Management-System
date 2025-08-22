const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder route
dbConnected = false;
app.get('/', (req, res) => {
  res.send('Express backend is running!');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://workbharatsharma:VZNFtSY6IHFJzzgt@messdeck.njx0xjb.mongodb.net/mess_management_system";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    dbConnected = true;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Connected to MongoDB: ${MONGO_URI}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Import routes
const authRoutes = require('./api/auth');
const bookingsRoutes = require('./api/bookings');
const hallsRoutes = require('./api/halls');
const mealsRoutes = require('./api/meals');
const walletRoutes = require('./api/wallet');
const menusRoutes = require('./api/menus'); // New menu routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/menus', menusRoutes); // New menu routes
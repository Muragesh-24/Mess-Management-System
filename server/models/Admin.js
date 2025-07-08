const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  hallNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'manager',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema); 
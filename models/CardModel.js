const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  image: { type: String, default:'static/default.jpg' },
  points: { type: Number, default: Math.floor(Math.random() * 100) },
});

module.exports = mongoose.model('Card',cardSchema);
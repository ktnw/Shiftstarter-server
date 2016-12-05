// Load required packages
var mongoose = require('mongoose');

// Define slot schema
var ShiftSchema   = new mongoose.Schema({
  class: String,
  start: Date,
  end: Date,
  total_slots: Number,
  slots: Array
});

// Export the Mongoose model
module.exports = mongoose.model('Shift', ShiftSchema);

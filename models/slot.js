// Load required packages
var mongoose = require('mongoose');

// Define slot schema
var SlotSchema   = new mongoose.Schema({
  stype: String,
  start: Date,
  end: Date,
  assigned: String
});

// Export the Mongoose model
module.exports = mongoose.model('Slot', SlotSchema);

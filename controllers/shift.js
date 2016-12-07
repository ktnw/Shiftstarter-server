// Load required packages

// Load models
var Shift = require('../models/shift');

// Create endpoint /api/v1/shifts for GET
exports.getShifts = function(req, res) {
  // Use the Shift model to find all shifts
  Shift.find(function(err, shifts) {
    if (err)
      res.send(err);

    res.json(shifts);
  });
};

// Create endpoint /api/v1/shifts for POST
exports.postShifts = function(req, res) {
  // Create a new instance of the Shift model
  var shift = new Shift();

  // Set the  properties that came from the POST data
  shift.class = req.body.class;
  shift.start = new Date(req.body.start);
  shift.end = new Date(req.body.end);
  shift.total_slots = req.body.total_slots;
  shift.slots = [];

  // Save the shift and check for errors
  shift.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Shift created successfully!', data: shift });
  });
};

// Create endpoint /api/shifts/:shift_id for GET
exports.getShift = function(req, res) {
  // Use the Shift model to find a specific shift
  Shift.findById(req.params.shift_id, function(err, shift) {
    if (err)
      res.send(err);

    res.json(shift);
  });
};

// Create endpoint /api/shifts/:shift_id/assign for PUT
exports.assignSlot = function(req, res) {
  currentUser = req.user;

  Shift.findById(req.params.shift_id, function(err, shift) {
    shift.assign(currentUser, function(err, shift) {
      if (err)
        res.status(403).send(err.message);

      res.json(shift);
    });
  });
};

// Create endpoint /shifts/:shift_id/release for PUT
exports.releaseSlot = function(req, res) {
  currentUser = req.user;
  // Find the specific shift
  Shift.findById(req.params.shift_id, function(err, shift) {
    shift.release(currentUser, function(err, shift) {
      if (err)
        res.status(403).send(err.message);

      res.json(shift);
    });
  });
};


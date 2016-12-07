// Load required packages

// Load models
var Shift = require('../models/shift');

// Create endpoint /api/v1/shifts for GET
// Use the Shift model to find all relevant shifts (matching the account and the class)
exports.getShifts = function(req, res) {
  var currentUser = req.user;
  var filter = { "account" : currentUser.account, "class" : currentUser.class };

  Shift.find( filter, function(err, shifts) {
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
  var currentUser = req.user;
  var filter = { "_id" : req.params.shift_id, "account" : currentUser.account, "class" : currentUser.class };

  Shift.findOne( filter, function(err, shift) {
    if (shift) {
      shift.assign(currentUser, function(err, shift) {
        if (err)
          res.status(403).send(err.message);

        res.json(shift);
      });
    } else {
      res.status(404).send("Shift not found.");
    }
  });
};

// Create endpoint /shifts/:shift_id/release for PUT
// it's not really required to protect the shift by filtering by account+class, but if account or class don't match
// the API should return 404 "resource not found" rather than 403 "Cannot release the slot",
// which is not a big issue, but it would point to the existence of a resource that the user doesn't have the privilege to operate on.
exports.releaseSlot = function(req, res) {
  var currentUser = req.user;
  var filter = { "_id" : req.params.shift_id, "account" : currentUser.account, "class" : currentUser.class };

  Shift.findOne( filter, function(err, shift) {
    if (shift) {
      shift.release(currentUser, function(err, shift) {
        if (err)
          res.status(403).send(err.message);

        res.json(shift);
      });
    } else {
      res.status(404).send("Shift not found.");
    }
  });
};


// Load required packages

// Load models
var Shift = require('../models/shift');

// Create endpoint /api/v1/shifts for GET
// Use the Shift model to find all relevant shifts (matching the account and the class)
exports.getShifts = function(req, res) {
  var currentUser = req.user;
  var now = new Date();
  var addedFilter = req.query.f;

  // we use "end" so that also the current running shift is shown until it ends, then it's not shown anymore
  var filter = { "account" : currentUser.account, "class" : currentUser.class, "end" : { $gt: now } };

  if (addedFilter == "my")
    filter.slots = currentUser._id;

  Shift.find( filter, function(err, shifts) {
    if (err)
      res.send(err);

    res.json(shifts);
  }).sort( { start: 1 } );
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


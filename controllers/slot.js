// Load required packages

// Load models
var Slot = require('../models/slot');

// Create endpoint /api/v1/slots for GET
exports.getSlots = function(req, res) {
  // Use the Slot model to find all slots
  Slot.find(function(err, slots) {
    if (err)
      res.send(err);

    res.json(slots);
  });
};

// Create endpoint /api/v1/slots for POST
exports.postSlots = function(req, res) {
  // Create a new instance of the Slot model
  var slot = new Slot();

  // Set the slot properties that came from the POST data
  slot.stype = req.body.stype;
  slot.start = new Date(req.body.start);
  slot.end = new Date(req.body.end);
  slot.assigned = req.body.assigned;

  // Save the slot and check for errors
  slot.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Slot created successfully!', data: slot });
  });
};

// Create endpoint /api/slots/:slot_id for GET
exports.getSlot = function(req, res) {
  // Use the Slot model to find a specific slot
  Slot.findById(req.params.slot_id, function(err, slot) {
    if (err)
      res.send(err);

    res.json(slot);
  });
};

// Create endpoint /api/slots/:slot_id/assign for PUT
exports.assignSlot = function(req, res) {
  currentUser = req.user;
  // Use the Slot model to find a specific slot
  Slot.findById(req.params.slot_id, function(err, slot) {
    
    if (err)
      res.send(err);

    // Toggle the existing slot assignment

    if ( slot.assigned !=="" && slot.assigned !== currentUser.username ) {
      res.status(403).send( 'Cannot modify this assignment.' )
    } else {
      if ( slot.assigned == "" ) {
        slot.assigned = currentUser.username
      } else {
        slot.assigned = ""
      }
      slot.save(function(err) {
        if (err)
          res.send(err);

        res.json(slot);
      });
    }

  });
};
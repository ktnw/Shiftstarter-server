/*
THIS WHOLE CONTROLLER IS NOT REQUIRED FOR THE API

// Load required packages

// Load models
var User = require('../models/user');

// Create endpoint /api/v1/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

// Create endpoint /api/v1/users for POST
exports.postUsers = function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    user.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
}

*/
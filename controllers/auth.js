// Load required packages
var passport = require('passport');
//var BasicStrategy = require('passport-http').BasicStrategy;
//var BearerStrategy = require('passport-http-bearer').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jwt-simple');

// Load configuration
var config = require('../config/config');

// Load models
var User = require('../models/user');

// Create endpoint /api/v1/auth for POST
exports.postAuth = function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.status(401).send('Authentication failed.');
    } else {
      // check if password matches
      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);

          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send('Authentication failed.');
        }
      });
    }
  });
};


// -JD this is not used at the moment, should I use this instead of the one above?
// -this would require to replace in server.js:
// router.route('/auth').post(authController.postAuth);
// with something like:
// router.route('/auth').post(authController.isAuthenticated);
/*
passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));
*/

var opts = {};
opts.secretOrKey = config.secret;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

passport.use(new JwtStrategy(
  opts, function(jwt_payload, callback) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
      if (err) { return callback(err, false); }

      if (user) {
        callback(null, user);
      } else {
        callback(null, false);
      }

    });
  }
));


// Get the current user based on the JWT token
/*
exports.currentUser = function(req, res) {
  token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
      }, function(err, user) {
          if (err) throw err;

          if (user) {
            req.user = user;
          }
    });
  };
};


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
*/

//exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isJwtAuthenticated = passport.authenticate('jwt', { session: false });

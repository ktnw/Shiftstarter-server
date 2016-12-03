// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');

// Load configuration
var config = require('./config/config');

// Load controllers
var slotController = require('./controllers/slot');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var testController = require('./controllers/test');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shiftstarter2');

// Create our Express application
var app = express();


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Request-Method', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    next();
}

// Use CORS options
app.use(allowCrossDomain);

// Use body-parser
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Use passport
app.use(passport.initialize());

// Enable logging to console
app.use(morgan('dev'));


// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /slots
router.route('/slots')
  .post(authController.isJwtAuthenticated, slotController.postSlots)
  .get(authController.isJwtAuthenticated, slotController.getSlots);

// Create endpoint handlers for /slots/:id
router.route('/slots/:slot_id')
  .get(authController.isJwtAuthenticated, slotController.getSlot);

// Create endpoint handler for /slots/:id/assign
router.route('/slots/:slot_id/assign')
  .put(authController.isJwtAuthenticated, slotController.assignSlot);

// Create endpointhandlers for /users
router.route('/users')
  .get(userController.getUsers)
  .post(userController.postUsers);

router.route('/auth')
  .post(authController.postAuth);

router.route('/test')
  .get(authController.isJwtAuthenticated, testController.getHello);

// Register all our routes with /api
app.use('/api/v1', router);

// Start the server
app.listen(port);
console.log('Server running on port ' + port);

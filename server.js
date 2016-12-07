// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');

// Load configuration
var config = require('./config/config');

// Load controllers
var shiftController = require('./controllers/shift');
//var userController = require('./controllers/user');
var authController = require('./controllers/auth');

// Connect to MongoDB, configure in config.js
mongoose.connect( config.database );

// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log( config.database );
  console.log('DB connection: SUCCESS');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log( config.database );
  console.log('DB connection: ERROR');
  console.log(err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('DB connection: DISCONNECTED'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('DB connection: CLOSED'); 
    process.exit(0); 
  }); 
}); 



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

// Create endpoint handlers for /shifts
router.route('/shifts')
  .get(authController.isJwtAuthenticated, shiftController.getShifts);

// Create endpoint handler for /shifts/:id/assign
router.route('/shifts/:shift_id/assign')
  .put(authController.isJwtAuthenticated, shiftController.assignSlot);

// Create endpoint handler for /shifts/:id/release
router.route('/shifts/:shift_id/release')
  .put(authController.isJwtAuthenticated, shiftController.releaseSlot);

router.route('/auth')
  .post(authController.postAuth);

// Register all our routes with /api
app.use('/api/v1', router);

// Start the server
app.listen(port);
console.log('Server running on port ' + port);

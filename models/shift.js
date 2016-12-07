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

ShiftSchema.methods.assign = function(user, callback) {
  var shift = this;

  // Don't allow this if the user is already having one slot assigned in the same shift
  if (shift.slots.indexOf(user._id) == -1 ) {

		// Break out if all slots have already been taken
		if (shift.total_slots > shift.slots.length)  {
			shift.slots.push(user._id);
			shift.save(function(err) {
				if (err) {
					console.log(err.message);
					callback(new Error('Unable to save the record.'));
				} else {
					//return json(shift);
					callback(null, shift);
				}
			});
		} else {
			err = new Error('Unable to assign the slot, please retry.');
			console.log(err.message);
			callback(err);
		}
	} else {
		err = new Error('This user already has a slot assigned in this shift.');
		callback(err);
	}
};

ShiftSchema.methods.release = function(user, callback) {
	var shift = this;

	if (shift.slots.indexOf(user._id) > -1 ) {
		// could use array.splice(i, 1) but that removes only 1 occurence. ECMA6 arr.filter appears 2x slower than the following solution.
		var a = shift.slots;
		shift.slots = [];
		for (var i = 0; i < a.length; ++i) {
    		if ( new String(a[i]).valueOf() !== new String(user._id).valueOf() ) shift.slots.push(a[i]);
		};
		shift.save(function(err) {
	    	if (err) {
	      		console.log(err.message);
	      		callback(new Error('Unable to save the record.'));
	      	} else {
	      		callback(null, shift);
	    	}
	    });
	} else {
	  err = new Error( 'Cannot release the slot.' );
	  console.log(err.message);
	  callback(err);
	};
};


// Export the Mongoose model
module.exports = mongoose.model('Shift', ShiftSchema);

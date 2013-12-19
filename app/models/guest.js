// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	validate = require('mongoose-validator').validate;

var nameValidate = [ validate('isAlphanumeric'), validate({message: 'name cannot be blank'}, 'notEmpty')];
var GuestSchema = new Schema({
	_invite:{type:Schema.ObjectId, ref:'Invite'},
	firstName: { type: String, trim: true, validate:nameValidate },
	lastName: { type: String, trim: true, validate:nameValidate },
	entree: String, // will be a document
	songs:{ name: {type:String, trim:true},
			artist: {type:String, trim:true}
	},
	table: Number
});



GuestSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

/**
 * validation
 */


/*GuestSchema.path('firstName').validate(function (firstName) {
  // if you are authenticating by any of the oauth strategies, don't validate
  console.log('firstName',firstName.length);
  return firstName.length > 0
}, 'first name cannot be blank');


GuestSchema.path('lastName').validate(function (lastName) {
  // if you are authenticating by any of the oauth strategies, don't validate
  console.log('lastName',lastName.length);
  return lastName.length > 0
}, 'last name cannot be blank');*/


/**
 * Statics
 */

GuestSchema.statics = {

	list: function (cb) {
		this.aggregate(
		  	{$unwind:'$name'},
		  	{ $project : {
		        first : '$name.first' 
		    }}, function(err, db) {
		    	console.log(db);
		    	cb(err, db);
		    })

		}
}


mongoose.model('Guest', GuestSchema);


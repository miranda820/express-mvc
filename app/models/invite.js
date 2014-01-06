// Example model

var mongoose = require('mongoose'),
	validate = require('mongoose-validator').validate,
	Schema = mongoose.Schema;

var isEmail = validate({message: 'Invalid Email'}, 'isEmail');
var InviteSchema = new Schema({
	primary:{type:Schema.ObjectId, ref:'Guest'},
	plusx:[{type:Schema.ObjectId, ref:'Guest'}],
	address: { type: String, trim:true, validate: validate({message: 'Address cannot be blank'}, 'notEmpty')},
	address2:String,
	city: { type: String, trim:true, validate: validate({message: 'City cannot be blank'}, 'notEmpty')},
	state: String,// will be sub document
	zipcode: { type: String, trim:true, validate: validate({message: 'invalid zipcode'}, 'regex', /^\d{5}(?:[-\s]\d{4})?$/i )},
	rsvp: {type:Boolean, default: false}
})


InviteSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

InviteSchema.methods = {

}
/**
 * validation
 */

/*GuestSchema.pre('save', function(next){
	if(this.name.first.trim().is)
})*/


/**
 * Statics
 */

InviteSchema.statics = {

	list: function (cb) {
		this.aggregate(
		  	{$unwind:'$name'},
		  	{ $project : {
		        first : '$name.first' 
		    }}, function(err, db) {
		    	console.log(db);
		    	cb(err, db);
		    })

	},

	getPlusx: function(_id, cb) {
		this.findOne({primary: _id})
		.populate('plusx')
		.exec(cb);
	},
	
	populateAll: function(cb) {
	 	this.find()
	 	.populate('primary plusx')
		.exec(cb);

	}

}

mongoose.model('Invite', InviteSchema);


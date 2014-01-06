// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	validate = require('mongoose-validator').validate;

var nameValidate = [ validate('isAlphanumeric'), validate({message: 'name cannot be blank'}, 'notEmpty')];
var GuestSchema = new Schema({
	firstName: { type: String, trim: true, validate:nameValidate },
	lastName: { type: String, trim: true, validate:nameValidate },
	entree: String, // will be a document
	songs:[{ name: {type:String, trim:true},
			artist: {type:String, trim:true}
	}],
	table: Number,
	isPrimary: {type:Boolean, default: false},
	isAdmin: {type:Boolean, default: false}
});


GuestSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });


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

	},

	getPlusx: function(cb) {
		this.find({isPrimary: false}, cb);
	},

	isAdmin:function(firstName, lastName, cb) {
		this.findOne({firstName:firstName, lastName: lastName, isAdmin: true}, cb);	
	}
}



mongoose.model('Guest', GuestSchema);





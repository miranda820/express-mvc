// Example model

var mongoose = require('mongoose'),
	validate = require('mongoose-validator').validate,
	Schema = mongoose.Schema;

var isEmail = validate({message: 'Invalid Email'}, 'isEmail');
var InviteSchema = new Schema({
	primary:{type:Schema.ObjectId, ref:'GuestList', required: true},
	plusx:[{type:Schema.ObjectId, ref:'GuestList'}],
	address: { type: String, trim:true, required: true},
	address2:String,
	city: { type: String, trim:true, required: true},
	state: String,// will be sub document
	zipcode: { type: String, trim:true, required: true,validate: validate({message: 'invalid zipcode'}, 'regex', /^\d{5}(?:[-\s]\d{4})?$/i )}
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
	
	populateAll: function(cb) {
	 	this.find()
	 	.populate('primary plusx')
		.exec(cb);

	},
	getPrimary: function(id,cb) {
	 	this.findOne({primary: id})
	 	.populate('primary plusx')
		.exec(cb);
	},

	getPlusOne: function(id,cb) {
	 	this.findOne({plusx: id})
	 	.populate('primary plusx')
		.exec(cb);
	}

}

mongoose.model('Invite', InviteSchema);


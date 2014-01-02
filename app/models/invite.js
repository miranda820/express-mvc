// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var InviteSchema = new Schema({
	primary:{type:Schema.ObjectId, ref:'Guest'},
	plusX:[{type:Schema.ObjectId, ref:'Guest'}],
	email: String,
	address: String,
	address2:String,
	city: String,
	state: String,// will be sub document
	zipcode: String,
	rsvp: {type:Boolean, default: false}
})


InviteSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

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

		}
}

mongoose.model('Invite', InviteSchema);


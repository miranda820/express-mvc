// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GuestSchema = new Schema({
	name:[{first: String, last: String}]
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

		}
}


mongoose.model('Guest', GuestSchema);

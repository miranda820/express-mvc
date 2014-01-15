// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	validate = require('mongoose-validator').validate;

var ValidationError = require('mongoose/lib/errors/validation');
var ValidatorError =  require('mongoose/lib/errors/validator');


var nameValidate = [ validate("regex",/^[a-z ,.-]+$/i), validate({message: 'name cannot be blank'}, 'notEmpty')],
	isEmail = validate({message: 'Invalid Email'}, 'isEmail');
var GuestSchema = new Schema({
	guestId:{type:Schema.ObjectId, ref:'GuestList', validate:validate({message: 'ID cannot be blank'}, 'notEmpty')},
	email:{ type: String, default: '', required: true, validate:isEmail},
	hashed_password: { type: String, default: '', required: true, validate:validate({message: 'password cannot be blank'}, 'notEmpty')},
  	salt: { type: String, default: '' },

	entree: String, // will be a document
	note:{ type: String,trim:true, default: '' },
	songs:[{ name: {type:String, trim:true},
			artist: {type:String, trim:true}
	}],
	picture: { type: String, trim:true, default: '' },
	table: Number,
	isAdmin: {type:Boolean, default: false},
	isPrimary: {type:Boolean, default: false},
	rsvp: {type:Boolean, default: false}
});




/*GuestSchema.pre('save', function(next) {
	 var Guest = mongoose.model('Guest');
	 Guest.findOne({ email: this.email }, function(err, guest) {
	 	console.log('pre save',guest);
	 	if(guest) {
	 		error = new ValidationError(this);
		    error.errors.email = new ValidatorError('email', 'already exist', this.email);
			next(error);	
	 	} 
	 	return next();
	 })
    
})*/

// GuestSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

GuestSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })


GuestSchema.methods = {
	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + ''
	},
	encryptPassword: function (password) {
		if (!password) return ''
		
		var encrypred
		try {
			encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
			return encrypred
		} catch (err) {
			return ''
		}
	},
	/**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  }
}
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

	getUser: function(cb) {
	 	this.find({isAdmin:false})
	 	.populate('guestId')
		.exec(cb);

	},

	getPlusx: function(cb) {
		this.find({isPrimary: false}, cb);
	},

	isAdmin:function(firstName, lastName, cb) {
		this.findOne({firstName:firstName, lastName: lastName, isAdmin: true}, cb);	
	},

}



mongoose.model('Guest', GuestSchema);





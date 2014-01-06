// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	validate = require('mongoose-validator').validate;

var nameValidate = [ validate('isAlphanumeric'), validate({message: 'name cannot be blank'}, 'notEmpty')],
	isEmail = validate({message: 'Invalid Email'}, 'isEmail');
var GuestSchema = new Schema({
	firstName: { type: String, trim: true, validate:nameValidate },
	lastName: { type: String, trim: true, validate:nameValidate },
	email: { type: String, validate:isEmail },
	hashed_password: { type: String, default: '', validate: validate({message: 'name cannot be blank'}, 'notEmpty')},
  	salt: { type: String, default: '' },
	entree: String, // will be a document
	songs:[{ name: {type:String, trim:true},
			artist: {type:String, trim:true}
	}],
	table: Number,
	isComing: {type:Boolean, default:true},
	isPrimary: {type:Boolean, default: false},
	isAdmin: {type:Boolean, default: false}
});


GuestSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

GuestSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

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
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }
}



mongoose.model('Guest', GuestSchema);





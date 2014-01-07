//for admin use only
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	validate = require('mongoose-validator').validate;


var ValidationError = require('mongoose/lib/errors/validation');
var ValidatorError =  require('mongoose/lib/errors/validator');


var nameValidate = [ validate("regex",/^[a-z ,.-]+$/i), validate({message: 'name cannot be blank'}, 'notEmpty')],
	emailValidate = [ validate({message: 'Invalid Email'}, 'isEmail'),  validate({message: 'name cannot be blank'}, 'notEmpty')];

var GuestListSchema = new Schema({
	firstName: { type: String, trim: true, validate:nameValidate },
	lastName: { type: String, trim: true, validate:nameValidate },
	email: { type: String, validate: emailValidate },
	isPrimary: {type:Boolean, default: false} // if guest is create by admin isPrimary is true
})






mongoose.model('GuestList', GuestListSchema);


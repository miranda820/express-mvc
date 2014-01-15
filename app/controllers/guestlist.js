var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
	_ = require('underscore'),
	guest = require('../../app/controllers/guest')
	GuestList = mongoose.model('GuestList');



exports.checkGuest = function  (req, res, next) {
	console.log(req.body.email);
	GuestList.findOne({email: req.body.email}, function(err, guestlist) {
		if(err) { return next(err)}
		if(guestlist) {
			guest.checkUser(req,res,next, guestlist._id);
		} else {
			// gues doesn't exist
			return res.send({
				status:'error',
				errors: {
					message:'hummm your email is incorrect or you are not on the guest list, please contact M & M'
				}
			})

		}

	})
}



exports.addToGuestList = function (guestData,cb){
	//create guest in guestlist model
	var newGuest = new GuestList(guestData);
	newGuest.save(function(err,guest) {

		if(err) {
			return res.send( {
				status: 'error',
				errors: utils.errors(err.errors)
			})
		} else {
			//guest created successfully

			//callback
 			if(typeof cb != 'function'){
 				return
 			}
			cb(guest);
		}
	});
}

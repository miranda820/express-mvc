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

exports.guestID = function (req, res, next, id) {
	GuestList.findOne({ _id : id })
		.exec(function (err, user) {
			if (err) return next(err)
			if (!user) {
				return res.send({
					status:'error',
					errors: {
						message:'guest doesn\'t exist'
					}
				})
			}

			req.profile = user
			next()
		})
}
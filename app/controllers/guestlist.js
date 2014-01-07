var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
	_ = require('underscore'),
	GuestList = mongoose.model('GuestList'),
	Guest = mongoose.model('Guest');



exports.checkGuest = function  (req, res) {
	console.log(req.body.email);
	GuestList.findOne({email: req.body.email}, function(err, guest) {
		if(err) { return next(err)}
		if(guest) {
			//check is guest is registered
			Guest.findOne({guestId: guest._id}, function(err, user) {

				 if(user) {
						//guest is registered ask to login
						return res.render('login',{
								email: req.body.email,
								renderLayout: false

							} //TODO send json back
						);
				 } else {
						//guest is not registered
						//
						return res.render('guest/register',{
								renderLayout: false,
								isPrimary: guest.isPrimary,
								guestId: guest._id
							} //TODO send json back
						);

				 }
			})
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
			if (!user) return next(new Error('Failed to load User ' + id))
			req.profile = user
			next()
		})
}
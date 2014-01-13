var mongoose = require('mongoose'),
		Guest = mongoose.model('Guest'),
		GuestList = mongoose.model('GuestList');

/*
 *  Generic require login routing middleware
 */

exports.checkGuestList = function (req, res, next) {
	GuestList.findOne({email: req.body.email}, function(err, guest) {
		if(err) { next(err)}
		//if user is on the guest list 
		
		if(guest) {

			Guest.findOne({
				guestId: guest._id,
				email: guest.email
			},function (err, register) {
				if(register) {
					// if guest exist
					return res.redirect('/login')
				}
				req.profile = guest;
				return next();
			})
			
		} else {
		 return res.send({
				status:"error",
				message:"Hummm, you are not on the guest list. Did you use a correct email? Please contact M & M"
			})
		}
	})
}

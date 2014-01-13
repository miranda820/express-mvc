var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
	Invite = mongoose.model('Invite');



function showPlusOne(req, res, guestId) {
	Invite.getPlusOne(guestId, function(err, invite){
		if (err) { return done(err) }
		if(invite) {
			return res.render('guest/index',{
				showPrimary: false,
				title:'M and M are getting married!',
				guest: req.user,
				invite: invite
			});
		} else {
			//flag the guest

			return res.render('error',{
			})
		}
	})
}

exports.index = function(req, res) {
	//for primary user
	//var user = req.profile;
	if(req.user.isPrimary) {

		Invite.getPrimary(req.user.guestId, function(err, invite){
			if(err) {
				return res.send( {
					status: 'error',
					errors: err
				})
			}
			//if guest is regested
			if(invite) {
				return res.render('guest/index',{
					showPrimary: true,
					isPrimary:true,
					title:'M and M are getting married!',
					guestId:req.user.guestId,
					plusx: invite.plusx,
					guest: invite.primary,
					invite: invite
				})
			}
			//if guest didn't register
			return res.render('guest/index',{
				showPrimary: true,
				title:'M and M are getting married!',
				isPrimary:true,
				guestId:req.user.guestId,
			})
		})


	} else {

		showPlusOne(req, res, req.user.guestId);

	}
	
}

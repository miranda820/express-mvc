var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
	_ = require('underscore'),
	GuestList = mongoose.model('GuestList'),
	Guest = mongoose.model('Guest'),
	Invite = mongoose.model('Invite');

var login = function (req, res) {
	console.log(req.session);
}



/**
 * Session
 */

exports.session = login;

/**
 * Login
 */
exports.login = function(req, res, phase){
	if(req.user) {
		if(phase === 1) {
			res.redirect('/guest/register');
		} else {
			res.redirect('/details');
		}
	}
	res.render('home/index', {
			title: 'M&M are getting married!'
		});
};

exports.loginFrom = function (req, res) {
		res.render('login', {
				title: 'M&M are getting married!'
			});
}

/*exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/');
}*/

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.checkUser = function(req, res,next, guestId){
	//check is guest is registered
	Guest.findOne({guestId: guestId}, function(err, user) {

		 if(user) {
				//guest is registered ask to login
				return res.render('login',{
						email: req.body.email,
						renderLayout: false

					} //TODO send json html back
				);
		 } else {
				//guest is not registered
				//
				return res.render('guest/register',{
						renderLayout: false,
						createPW: true,
						guestId: guestId
					} //TODO send json html back
				);

		 }
	})
};
exports.addplusx = function (req, res) {
		//find current logged in guest should be primary guest
		Invite.findOne({primary: req.user._id}, function(err, invite) {
			if(invite) {
				//only allow on X amount of guest
				//TODO change "1" to a configurable number 
				if(invite.plusx.length < 1) {

					//create plus one in guest model
					var plusGuest = new Guest(req.body);
					plusGuest.save(function(err,plus) {

						if(err) {
							return res.send( {
								status: 'error',
								errors: utils.errors(err.errors)
							})
						}
					});
					//add plus one's id to invite
					invite.plusx.push(plusGuest);
					invite.save(function (err, invite) {
						if(err) {
							return res.send( {
								status: 'error',
								errors: utils.errors(err.errors)
							})
						}

						return res.send({
							status: 'success',
							plusx: invite.plusx
						});

					});
				} else {
					//if primary guest already has a plus one
					return res.send({
						status: 'error',
						errors: 'alreay registered your plus one'
					});
				}

			} else {
				return res.send({
					status: 'not registered, please registered first before add plus one'
				});
			}

		})
		

}

exports.create = function (req, res) {
	//check against guestlist
	var guestList = req.profile
	var data = _.extend(req.body, 
			{ 	guestId: guestList._id, 
				email:guestList.email, 
				isPrimary:guestList.isPrimary
			}),
		guest = new Guest(data);

	guest.save(function(err, guest){
		if(err) {
			return res.send( {
				status: 'error',
				errors: utils.errors(err.errors),
				guest: guest
			})
		}
		//create password successfully
		if(guestList.isPrimary) {
			return res.render('guest/register',{
				isPrimary:true,
				guestId: guestList._id
			})//TODO add json html

		} else {
			return res.render('login',{
				title:'login'
			})//TODO add json html

		}
	});


}

exports.destination = function (req,res,phase){

	if (req.user.isPrimary) {
		if(phase === 1) {
			res.redirect('/guest/register');
		} else {
			res.redirect('/details');
		}
	} else {
		res.redirect('/details');
	}
}

exports.index = function(req, res) {
	return res.render('details/index', {
		title:'M and M are getting married!',
		guest: req.user
	})
}


exports.register = function(req, res) {
	Invite.findOne({primary: req.user.guestId}, function(err, invite) {
		if(err) {return next(err)}

		return res.render('guest/register', {
			title:'M and M are getting married!',
			isPrimary: req.user.isPrimary,
			guestId: req.user.guestId,
			invite: invite,
			renderLayout: true
		})

	})
	
}
var mongoose = require('mongoose'),
	_ = require('underscore'),
	//sanitize = require('mongoose-validator').sanitize,
	utils = require('../../lib/utils'),
	guestlist = require('../../app/controllers/guestlist'),
	Invite = mongoose.model('Invite');






exports.index = function(req, res) {
	console.log(res.user);
	return res.render('details/index', {
		title:'M and M are getting married!',
		guest: req.user
	})
}
function response (req, res, err, invite) {
	if(err) {
		return res.send( {
			status: 'error',
			errors: utils.errors(err.errors),
		})
	}

	return res.send({
		status: 'success',
		invite: invite
	})
}


exports.createAndUpdate = function (req, res,next) {
	var thisGuest = req.user; // the data is from guestlist model

	//check invite exists
	Invite.findOne({primary: thisGuest.guestId}).exec(function(err, invite) {

		if(!invite) {
			//create the invite
			var data = _.extend(req.body, {primary: thisGuest.guestId, user: thisGuest._id} ),
				invite = new Invite(data);

			invite.save(function(err, invite){
				response(req,res, err, invite);
			});

		} else {
			//update the invite
			var invite = _.extend(invite, req.body);
			invite.save(function (err) {
				response(req, res, err, invite);
			});
		}
	})


}

exports.createPlusOne = function (req, res) {
		//get current login guest's invite
		Invite.findOne({primary: req.user.guestId}, function(err, invite) {
			if(invite) {
				//only allow on X amount of guest
				//TODO change "1" to a configurable number 
				if(invite.plusx.length < 1) {
					guestlist.addToGuestList(req, res, req.body, function(newGuest) {
						//after guest is added to gueslist, add it to primary guest's invite
						invite.plusx.push(newGuest._id);
						invite.save(function (err, invite) {
							if(err) {
								return res.send( {
									status: 'error',
									errors: utils.errors(err.errors)
								})
							}

							return res.send({
								status: 'success',
								message: 'Pluse one is created'
							});

						});
					})
					
					
				} else {
					//if primary guest already has a plus one
					return res.send({
						status: 'error',
						errors: 'You already have a plus one'
					});
				}

			} else {
				return res.send({
					status: 'not registered, please registered first before add plus one'
				});
			}

		})
		

}
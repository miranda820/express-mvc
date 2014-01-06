var mongoose = require('mongoose'),
	_ = require('underscore'),
	//sanitize = require('mongoose-validator').sanitize,
	utils = require('../../lib/utils'),
	Guest = mongoose.model('Guest'),
	Invite = mongoose.model('Invite');



//see if guest has entered address
exports.checkRegistration = function(req, res){
	var thisGuest = req.currentUser
	console.log(req.currentUser);
	// is the guest is primary
	if(thisGuest.isPrimary)	{
		Invite.findOne({primary: thisGuest._id}, function(err, invite){
			if(err) throw new Error(err);
			if(!invite) {
				return res.render('guest/register',{
					renderPrimaryForm: true,
					renderLayout: false,
					firstName: thisGuest.firstName,
					lastName: thisGuest.lastName

				}/*, function(err, html) {

					var response = {
						status:'not registered',
						html:html
					}
					res.send(response);
				}*/);
				
			} else {
				return res.send({
						status:'registered',
						redirect:'/login'
				});
			}
		});
	} else {
		if(thisGuest.hash_password) {
			//is the guest is a plus one
			return res.redirect('/login');
		} 

		return res.render('guest/register',{
			renderPlusOneForm: true,
			renderLayout: false,
			firstName: thisGuest.firstName,
			lastName: thisGuest.lastName
		}/*, function (err, html ) {
			var response = {
				status:'not registered',
				html:html
			}
			res.send(response);
		}*/)
		
	}
};




exports.index = function(req, res) {
	console.log(res.user);
	return res.render('details/index', {
		title:'M and M are getting married!',
		guest: req.user
	})
}
function response (err, invite) {
		if(err) {
			return res.send( {
				status: 'error',
				errors: utils.errors(err.errors),
				invite: invite
			})
		}

		return res.send({
			status: 'success',
			invite: invite
		})
	}

exports.update = function (req, res) {

	
	/*function sanitizeData (data) {
		for (prop in data) {
			if(data.hasOwnProperty(prop)) {
				data[prop] = sanitize(data[prop]).escape();
			}
		}

		return data;
	}*/

	if(req.user.isPrimary) {

		Invite.findOne({primary: req.user._id}, function(err, invite){
			//if user hasn't fill the address,
			//create invite

			
			if(!invite) {

				var guestInfo = _.extend({ primary: req.user._id }, req.body),
					invitation = new Invite( guestInfo);

				invitation.save(function (err) {
					response(err, invite);
				});

			} else {

				var invite = _.extend(invite, req.body);
				invite.save(function (err) {
					response(err, invite);
				});
			}
		});
	} else {
		//

	}

}

exports.create = function (req, res) {
	Guest.findOne({firstName: req.body.firstName, lastName: req.body.lastName}, function(err, guest) {

		console.log('Guest', guest)
		if(guest){
			guest = _.extend(guest, req.body);
			invite.save(function (err, invite) {
					response(err, invite);
			});
		}
	})

}
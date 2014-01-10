var mongoose = require('mongoose'),
	_ = require('underscore'),
	//sanitize = require('mongoose-validator').sanitize,
	utils = require('../../lib/utils'),
	GuestList = mongoose.model('GuestList'),
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
	var thisGuest = req.profile;


		//check invite exists
		Invite.findOne({primary: thisGuest._id}).exec(function(err, invite) {

			if(!invite) {
				//create the invite
				var data = _.extend(req.body, {primary: thisGuest._id} ),
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


// if(req.body.plusone) {
// 		//save plusone first
// 		var guest = new GuestList(req.body);
// 		guest.save(function(err, guestList) {
// 			if (err) {
// 				return res.send({
// 					status: 'error',
// 					errors: utils.errors(err.errors),
// 					guest: guest
// 				})
// 			};
// 			createInvite ();
// 		})

// 	}
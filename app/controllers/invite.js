var mongoose = require('mongoose'),
	_ = require('underscore'),
	//sanitize = require('mongoose-validator').sanitize,
	utils = require('../../lib/utils'),
	Guest = mongoose.model('Guest'),
	Invite = mongoose.model('Invite');



//see if guest has entered address
exports.checkRegistration = function(req, res){
	function redirect (req, res, status) {
		return res.send( 'wedding/index',{
						status:status,
						redirect:'/details'
				});
	}
	if(req.user.isPrimary)	{
		Invite.findOne({primary: req.user._id}, function(err, invite){
			if(err) throw new Error(err);
			if(!invite) {
				return res.render('guest/register',{renderLayout: false}, function(err, html) {
					//var hour = 3600000;
		 		    //req.session.cookie.expires = new Date(Date.now() + hour);

					console.log('session', req.session);
					var response = {
						status:'not registered',
						html:html
					}
					res.send(response);
				});
				

			} else {
				return res.send( 'wedding/index',{
						status:'registered',
						redirect:'/details'
				});

				redirect (req, res, 'registered')
			}
		});
	} else {
		redirect (req, res, 'plusx')
	}
};

exports.index = function(req, res) {
	console.log(res.user);
	return res.render('details/index', {
		title:'M and M are getting married!',
		guest: req.user
	})
}


exports.update = function (req, res) {

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
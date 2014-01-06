var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
	Invite = mongoose.model('Invite');


var isPluseOne = function (req, res) {


}
//see if guest has entered address
exports.checkRegistration = function(req, res){
  Invite.findOne({primary: req.user._id}, function(err, invite){

	//console.log('invite', invite.length);
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
	   /* return res.render('home/index', {
		  title: 'M&M are getting married!',
		  guests: guests
		});*/
	}

  });
};

exports.index = function(req, res) {
	//for primary user
	if(req.user.isPrimary) {

		Invite.findOne({primary: req.user._id}, function(err, invite){
			if (err) { return done(err) }
			//if guest is regested
			if(invite) {

				Invite.getPlusx(req.user._id, function(err, thisInvite) {
					if (err) return next(err)
					return res.render('guest/index',{
						showPrimary: true,
						title:'M and M are getting married!',
						plusx: thisInvite.plusx,
						guest: req.user,
						invite: invite
					})
				})

				return;
			}
			//if guest didn't register
			return res.render('guest/index',{
				showPrimary: true,
				title:'M and M are getting married!',
				guest: req.user
			})
		})


	} else {

		Invite.findOne({plusx: req.user._id}, function(err, invite){
			if (err) { return done(err) }
			if(invite) {
				return res.render('guest/index',{
					showPrimary: false,
					title:'M and M are getting married!',
					guest: req.user,
					invite: invite
				});
			} else {
				return res.render('error',{
				})
			}
		})

	}
	
}

var mongoose = require('mongoose'),
	utils = require('../../lib/utils');
	Invite = mongoose.model('Invite');



//see if guest has entered address
exports.checkRegistration = function(req, res){
  Invite.findOne({primary: req.user._id}, function(err, invite){

	//console.log('invite', invite.length);
	if(err) throw new Error(err);

	if(!invite) {
		return res.render('guest/register',{renderLayout: false}, function(err, html) {
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
	return res.render('details/index', {
		title:'M and M are getting married!',
		guest: res.user
	})
}
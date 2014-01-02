var async = require('async');

var util = require('util'),
	auth = require('./middlewares/authorization'),
	guest = require('../app/controllers/guest'),
	invite = require('../app/controllers/invite'),
	admin = require('../app/controllers/admin');

module.exports = function(app, passport, mongoose){

//api
	app.post('/guest/create', admin.creatUser); 

	// route
	
	app.get('/', guest.login);
	app.get('/logout', guest.logout);

	//user
	app.post('/guest/session',passport.authenticate('local', {
      failureRedirect: '/guest/fail'
    }), function(req, res) {
			invite.checkRegistration(req, res);
    });

	app.get('/guest/fail', function(req, res) {
		return res.send({
			status: 'error',
			errorMessage: 'Hmmmmm, We can\'t find you'
		})

	});

	//app.get('/admin', admin.pluseone);
	app.get('/admin', admin.index);
	

	app.get('/details',auth.requiresLogin, invite.index);	

};

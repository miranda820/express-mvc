var async = require('async');

var util = require('util'),
	auth = require('./middlewares/authorization'),
	guestlist = require('../app/controllers/guestlist'),
	guest = require('../app/controllers/guest'),
	invite = require('../app/controllers/invite'),
	profile = require('../app/controllers/profile'),
	admin = require('../app/controllers/admin');

module.exports = function(app, passport, config){



	//app.get('/admin/login', admin.signin);
	app.get('/admin', admin.index);	
	app.post('/admin/create', admin.createAdmin);
	app.post('/api/guestlist/create',  admin.createGuest);//auth needed before create

	//api
	//api/guest/check  comes back with json with html or error 
	app.post('/api/guestlist/check', guestlist.checkGuest);
	app.post('/api/invite/create/:guestId', invite.createAndUpdate);
	app.post('/api/guest/create/:guestId', guest.create);

	app.param('guestId', guestlist.guestID)

	//app.post('/guest/addplusx',auth.requiresLogin, guest.addplusx);
	// route
	
	app.get('/', guest.login);
	app.get('/login', guest.loginFrom);
	app.get('/logout', guest.logout);

	//user

	app.post('/guest/session',passport.authenticate('local', {
      failureRedirect: '/guest/fail'
    }), function(req, res) {

			guest.destination(req, res, config.phase);
    });

	app.get('/guest/register', auth.requiresLogin, guest.register);

    
	//app.post('/invite/update', auth.requiresLogin, invite.update)
	app.get('/guest/fail', function(req, res) {
		return res.send({
			status: 'error',
			errorMessage: 'Hmmmmm, We can\'t find you'
		})

	});

	

	app.get('/details',auth.requiresLogin, guest.index);	

	app.get('/profile',auth.requiresLogin, profile.index);	




};

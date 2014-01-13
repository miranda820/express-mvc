var async = require('async');

var util = require('util'),
	auth = require('./middlewares/authorization'),
	guestlist = require('../app/controllers/guestlist'),
	guest = require('../app/controllers/guest'),
	invite = require('../app/controllers/invite'),
	profile = require('../app/controllers/profile'),
	admin = require('../app/controllers/admin');

module.exports = function(app, passport, config){


		
	app.get('/admin/login', admin.signin);
	app.post('/admin/session',passport.authenticate('local', {
      failureRedirect: '/guest/fail'
    }), function(req, res) {
			res.redirect('/admin');
    });
    app.get('/admin',auth.requiresAdmin, admin.index);
	app.post('/api/admin/create',auth.requiresAdmin, admin.createAdmin);
	app.post('/api/guestlist/create',auth.requiresAdmin, admin.createGuest);//auth needed before create


	//api
	//api/guest/check  comes back with json with html or error 
	app.post('/api/guestlist/check', guestlist.checkGuest);
	app.post('/api/invite/create/:guestId', invite.createAndUpdate);
	app.post('/api/guest/create/:guestId', guest.create);

	app.post('/api/invite/:guestId/create/plusone', invite.createPlusOne);

	app.param('guestId', guestlist.guestID);
	// route
	
	app.get('/', function(req, res) {
		guest.login(req, res, config.phase)
	} );
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
			errorMessage: 'Hmmmmm, Something went wrong'
		})

	});

	

	app.get('/details',auth.requiresLogin, guest.index);	

	app.get('/profile',auth.requiresLogin, profile.index);	
	



};

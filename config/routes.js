var async = require('async');

var util = require('util'),
	auth = require('./middlewares/authorization'),
	guestlist = require('../app/controllers/guestlist'),
	guest = require('../app/controllers/guest'),
	invite = require('../app/controllers/invite'),
	profile = require('../app/controllers/profile'),
	admin = require('../app/controllers/admin');

module.exports = function(app, passport, mongoose){



	//app.get('/admin/login', admin.signin);
	app.get('/admin', admin.index);

	/*app.post('/admin/session', passport.authenticate('admin', {
      failureRedirect: '/admin/login'
    }), function(req, res) {
    		res.redirect('/admin');
    });*/

	
	app.post('/admin/create', admin.createAdmin);

	//api
	//
	//api/guest/check  comes back with json with html or error 
	app.post('/api/guest/check', guestlist.checkGuest);

	//auth needed before create
	app.post('/api/guest/create',  admin.createGuest);
	app.post('/api/invite/create/:guestId', invite.create);
	app.param('guestId', guestlist.guestID)



	app.post('/guest/addplusx',auth.requiresLogin, guest.addplusx);
	// route
	
	app.get('/', guest.login);
	app.get('/login', guest.loginFrom);
	app.get('/logout', guest.logout);

	//user

	app.post('/guest/session',passport.authenticate('local', {
      failureRedirect: '/guest/fail'
    }), function(req, res) {
    		//returns json
			//invite.checkRegistration(req, res);
    });

    app.post('/guest/register', guest.checkUser, invite.checkRegistration);

    
	//app.post('/invite/update', auth.requiresLogin, invite.update)
	app.get('/guest/fail', function(req, res) {
		return res.send({
			status: 'error',
			errorMessage: 'Hmmmmm, We can\'t find you'
		})

	});

	//app.get('/admin', admin.pluseone);
	
	

	app.get('/details',auth.requiresLogin, invite.index);	

	app.get('/profile',auth.requiresLogin, profile.index);	




};

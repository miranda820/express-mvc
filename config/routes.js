var async = require('async');

var util = require('util'),
	auth = require('./middlewares/authorization'),
	userCheck = require('./middlewares/usercheck'),
	guestlist = require('../app/controllers/guestlist'),
	guest = require('../app/controllers/guest'),
	invite = require('../app/controllers/invite'),
	profile = require('../app/controllers/profile'),
	admin = require('../app/controllers/admin');

module.exports = function(app, passport, config){


		
	app.get('/admin/login', admin.signin);
	app.post('/admin/session', function (req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err); }
			if(!user) {
				return res.send({
					status: "error",
					message: "incorrect email or password"
				})
			}

			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/admin');
    		});
		})(req, res, next);

	});

    app.get('/admin',auth.requiresAdmin, admin.index);
	app.post('/api/admin/create',auth.requiresAdmin, admin.createAdmin);
	app.post('/api/guestlist/create',auth.requiresAdmin, admin.createGuest);//auth needed before create


	//api
	//api/guest/check  comes back with json with html or error 
	//app.post('/api/guestlist/check', guestlist.checkGuest);
	app.post('/api/invite/create', auth.requiresLogin, invite.createAndUpdate);
	app.post('/api/guest/create', userCheck.checkGuestList, guest.create);

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


	app.post('/guest/add/picture', auth.requiresLogin, guest.upload);
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

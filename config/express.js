var express = require('express'),
	expressValidator = require('express-validator'),
	mongoStore = require('connect-mongo')(express),
	flash = require('connect-flash'),
	cons = require('consolidate');

module.exports = function(app, config, passport) {
	app.engine('dust', cons.dust);
	app.configure(function () {
		app.use(express.compress());
		app.use(express.static(config.root + '/public'));
		app.set('port', config.port);
		app.set('views', config.root + '/app/views');
		app.set('view engine', 'dust');
		app.use(express.favicon(config.root + '/public/img/favicon.ico'));
		app.use(express.logger('dev'));
		// cookieParser should be above session
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
		app.use(express.methodOverride());

		app.use(express.session({
			secret: 'mmweddingsite@$123',
			store: new mongoStore({
				url: config.db,
				collection : 'sessions'
			}),
			cookie: {}
	    }));

	    // use passport session
    	app.use(passport.initialize());
    	app.use(passport.session());
    	app.use(flash());
    	
		app.use(app.router);
		app.use(function(req, res) {
		  res.status(404).render('404', { title: '404' });
		});
	});
};

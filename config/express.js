var express = require('express'),
	expressValidator = require('express-validator'),
	cons = require('consolidate');

module.exports = function(app, config) {
	app.engine('dust', cons.dust);
	app.configure(function () {
		app.use(express.compress());
		app.use(express.static(config.root + '/public'));
		app.set('port', config.port);
		app.set('views', config.root + '/app/views');
		app.set('view engine', 'dust');
		app.use(express.favicon(config.root + '/public/img/favicon.ico'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(function(req, res) {
		  res.status(404).render('404', { title: '404' });
		});
	});
};

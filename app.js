var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	mailer = require('nodemailer'),
	fs = require('fs'),
 	config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();
require('./config/passport')(passport, config);
require('./config/mailer')(mailer);
require('./config/express')(app, config, passport);
require('./config/routes')(app, passport, mailer, config);

app.listen(config.port);


// create admmin

Guest = mongoose.model('Guest');

Guest.findOne({
	email: config.admin.email
}, function (err, user) {
	if(err) { console.log(err)} 
	if(user) {
		console.log("admin exists",user)
	} else {
		var admin = new Guest({
			email: config.admin.email, 
			password:config.admin.password,
			isAdmin: true,
			isPrimary: true
		});
		admin.save(function(err, admin) {
			if(err) { return next(err)} 
			console.log('admin is create',admin);
		});
	}
})

exports = module.exports = app

var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
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
require('./config/express')(app, config, passport);
require('./config/routes')(app, passport);

app.listen(config.port);

exports = module.exports = app

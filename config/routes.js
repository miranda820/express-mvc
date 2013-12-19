var util = require('util');

module.exports = function(app, mongoose){

var home = require('../app/controllers/home'),
		admin = require('../app/controllers/admin');
//api
	app.post('/api/guests', admin.creatUser); 

	// route
	
	app.get('/', home.index);
	//app.get('/admin', admin.pluseone);
	app.get('/admin', admin.index);
	

};

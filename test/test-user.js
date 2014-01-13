var mongoose = require('mongoose'),
	should = require('should'),
	request = require('supertest'),
	app = require('../app'),
	context = describe,
  	Guest = mongoose.model('Guest');


/*describe('create guests', function () {
	it ('No first name - should responds with error', function (done) {
		request(app)
		.post('/guest/create')
		.field('firstName','*')
		.field('lastName','li')
		//.expect('Content-Type', /html/)
        .expect(200)
        .expect(/Invalid characters/)
        .end(done)
	})

	it ('No last name - should responds with error', function (done) {
		request(app)
		.post('/guest/create')
		.field('firstName','Miranda')
		.field('lastName','')
		//.expect('Content-Type', /html/)
		.expect(200)
		.expect(/name cannot be blank/)
		.end(done)
	})

});*/

//user login 

describe('Admin:', function () {
	it('Access admin page without login', function(done) {
		request(app)
		.get('/admin')
		.expect(302)
        .expect(/login/)
        .end(done)

	})
	it ('create Admin without login - should redirect to login', function (done) {
		request(app)
		.post('/api/admin/create')
		.field('email','miranda.li@gmail.com')
		.field('password','admin')
		//.expect('Content-Type', /html/)
        .expect(302)
        .expect(/login/)
        .end(done)
	})

	it ('create guest without login - should redirect to login', function (done) {
		request(app)
		.post('/api/guestlist/create')
		.field('firstName','Miranda')
		.field('lastName','li')
		.field('email','miranda.li@gmail.com')
		//.expect('Content-Type', /html/)
        .expect(302)
        .expect(/login/)
        .end(done)
	})

});


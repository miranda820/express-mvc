var mongoose = require('mongoose'),
	should = require('should'),
	request = require('supertest'),
	app = require('../app'),
	context = describe,
  	Guest = mongoose.model('Guest');


describe('Submit guests', function () {
	it ('No first name - should responds with error', function (done) {
		request(app)
		.post('/api/guests')
		.field('firstName','*')
		.field('lastName','li')
		//.expect('Content-Type', /html/)
        .expect(200)
        .expect(/Invalid characters/)
        .end(done)
	})

	it ('No last name - should responds with error', function (done) {
		request(app)
		.post('/api/guests')
		.field('firstName','Miranda')
		.field('lastName','')
		//.expect('Content-Type', /html/)
        .expect(200)
        .expect(/name cannot be blank/)
        .end(done)
	})

});
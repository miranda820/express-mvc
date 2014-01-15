var mongoose = require('mongoose'),
	should = require('should'),
	request = require('supertest'),
	app = require('../app'),
	async = require('async'),
	context = describe,
	GuestList = mongoose.model('GuestList'),
	Invite = mongoose.model('Invite'),
	Guest = mongoose.model('Guest');

var guestCount, inviteCount, cookie;

//user login 

describe('Admin', function () {
	before(function (done) {

		async.parallel([
			function (cb) {
				Invite.count(function (err, cnt) {
					inviteCount = cnt;
					cb(null, cnt);
				})
			},

			function (cb){
				Guest.count(function (err, cnt) {
					guestCount = cnt;
					cb(null, cnt);
				});
			}
		],done);
		
	});

	describe('without login', function () {
		it('No access to admin page without login', function(done) {
			request(app)
			.get('/admin')
			.expect(302)
			.expect(/login/)
			.end(done)

		})
		it ('Create Admin without login - should redirect to login', function (done) {
			request(app)
			.post('/api/admin/create')
			.field('email','miranda.li@gmail.com')
			.field('password','admin')
			//.expect('Content-Type', /html/)
			.expect(302)
			.expect(/login/)
			.end(done)
		})
		it ('Should not save admin to database', function(done) {
			Guest.count(function (err,cnt) {
				guestCount.should.equal(cnt);
				done();
			})
		})
		it ('Create guest without login - should redirect to login', function (done) {
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

		it ('Should not save guest to guestlist', function(done) {
			GuestList.count(function (err,cnt) {
				inviteCount.should.equal(cnt);
				done();
			})
		})
	});

	describe('Login', function () {
		it('Show login page', function (done) {
			request(app)
			.get('/admin/login')
			.expect(200)
			.expect(/Admin login/)
			.end(done);
		});

		describe('Incorrect login', function () {
			it('Login with incorrect email', function (done) {
				request(app)
				.post('/admin/session')
				.send({ email: 'incorrect email', password: 'admin'})
				.end( function (err, res){

					 res.should.have.status(200);
					 res.text.should.include('error');
					 done();
				});
			});


		});

		/*it('Login with correct email and password', function (done) {
			request(app)
			.post('/admin/session')
			.send({ email: 'admin@localhost.com', password: 'admin'})
			.end( function (err, res){

				 res.should.have.status(302);
				 res.header.location.should.include('/admin');
				 done();
			});
			
		});*/


		describe('create user', function () {
			before(function (done) {
				request(app)
				.post('/admin/session')
				.send({ email: 'admin@localhost.com', password: 'admin'})
				.end( function (err, res){

					res.should.have.status(302);
					res.header.location.should.include('/admin');
					cookie = res.headers['set-cookie'];

					request(app)
					.get('/admin')
					.set('cookie', cookie)
					.end(function (err, res) {  
						res.should.have.status(200);
						res.text.should.not.include('create admin');
						done();
					});
				});
			})

			/*it('create new guest', function() {
				
			})*/
		})


	}) 
});

/*
 it('Existing user should be able to login with credentials', function (done) {
	  request(app)
		.post('/users/session')
		.send({ email: 'john.doe@test.com', password: 'j0hnd0e1'})
		.end(function (err, res) {
		  res.should.have.status(302); //Redirected
		  res.header.location.should.include('/'); //To homepage
		  var cookie = res.headers['set-cookie'];
		  // When logged in, requested homepage should display user name and Log Out
		  request(app)
			.get('/')
			.set('cookie', cookie)
			.end(function (err, res) {  
			  res.should.have.status(200);
			  res.text.should.include('John');
			  res.text.should.include('Log Out');
			  res.text.should.not.include('Admin');
			  done();
			});
		});
	});
 */

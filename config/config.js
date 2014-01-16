var path = require('path'),
		rootPath = path.normalize(__dirname + '/..'),
		env = process.env.NODE_ENV || 'development',
		phase = 2,
		mailService = "Gmail",
		mailName = "Your Name",
		mailUser = "user.account@gmail.com",
		mailPass = "password";



var config = {
	development: {
		root: rootPath,
		app: {
			name: 'express-mvc'
		},
		port: 8000,
		db: 'mongodb://localhost/wedding-dev',
		phase:phase,
		admin: {
			email:'admin@localhost.com',
			password:'admin'
		},
		mailer: {
			service: mailService,
			name: mailName,
			user: mailUser,
			pass: mailPass
		}
	},

	test: {
		root: rootPath,
		app: {
			name: 'express-mvc'
		},
		port: 8000,
		db: 'mongodb://localhost/wedding-test',
		phase:phase,
		admin: {
			email:'admin@localhost.com',
			password:'admin'
		},
		mailer: {
			service: mailService,
			name: mailName,
			user: mailUser,
			pass: mailPass
		}
	},

	production: {
		root: rootPath,
		app: {
			name: 'express-mvc'
		},
		port: 8000,
		db: 'mongodb://localhost/wedding-production',
		phase:phase,
		admin: {
			email:'admin@localhost.com',
			password:'admin'
		},
		mailer: {
			service: mailService,
			name: mailName,
			user: mailUser,
			pass: mailPass
		}
	}
};

module.exports = config[env];

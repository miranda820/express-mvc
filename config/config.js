var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    phase = 1;

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
    }
  }
};

module.exports = config[env];

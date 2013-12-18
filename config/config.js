var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'express-mvc'
    },
    port: 9000,
    db: 'mongodb://localhost/wedding-dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'express-mvc'
    },
    port: 9000,
    db: 'mongodb://localhost/wedding-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'express-mvc'
    },
    port: 9000,
    db: 'mongodb://localhost/wedding-production'
  }
};

module.exports = config[env];

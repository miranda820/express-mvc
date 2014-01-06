var mongoose = require('mongoose')
    LocalStrategy = require('passport-local').Strategy,
    Guest = mongoose.model('Guest');


module.exports = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    Guest.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'firstName',
      passwordField: 'lastName'
    },
    function(firstName, lastName, done) {
      Guest.findOne({ 
      		firstName: firstName,
      		lastName: lastName
      	}, function (err, guest) {
  			if (err) { return done(err) }
  			if (!guest) {
  				return done(null, false, { message: 'Unknown guest' });
  			}
  			return done(null, guest);
      })
    }
  ));

  // use two LocalStrategies, registered admin
  passport.use('admin', new LocalStrategy(
    {  usernameField: 'username',
      passwordField: 'password' },

    function(username, password, done) {

      console.log('username',username, 'password',password)
      Admin.findOne({
        username: username
      }, function (err, admin) {
        if (err) { return done(err) }
        if (!admin) {
          console.log('permission denied')
          return done(null, false, { message: 'permission denied' });
        }

        if (!admin.authenticate(password)) {
          console.log('Invalid password')
          return done(null, false, { message: 'Invalid password' })
        }

        console.log('find the admin')
        return done(null, admin);

      })
    }
  ));

}




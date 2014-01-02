var mongoose = require('mongoose'),
	utils = require('../../lib/utils');
	Guest = mongoose.model('Guest');

var login = function (req, res) {
  console.log(req.session);
}



/**
 * Session
 */

exports.session = login;

/**
 * Login
 */
exports.login = function(req, res){
  console.log('check signin', req.session);
  res.render('home/index', {
      title: 'M&M are getting married!',
      message: req.flash('error')
    });
};

/*exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
}*/

exports.logout = function (req, res) {
  req.logout();
  console.log('log out');
  console.log(req.session);
  res.redirect('/');
}

exports.checkUser = function(req, res){
  Guest.find(req.body, function(err, guests){

  	console.log('test', guests.length);
    if(err) throw new Error(err);

    if(guests.length < 1) {

    	return res.render( 'home/index',{
    			title: 'M&M are getting married!',
				contact: 'We can\'t find you, Please contact M&M'
			});

    } else {
    	console.log('check signin', req.session);
    	signin(req, res);
	   /* return res.render('home/index', {
	      title: 'M&M are getting married!',
	      guests: guests
	    });*/
	}

  });
};
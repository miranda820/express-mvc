var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
  _ = require('underscore'),
	Guest = mongoose.model('Guest'),
  Invite = mongoose.model('Invite');

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
  if(req.user) {
    res.redirect('/details')
  }
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
  res.redirect('/');
};

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
exports.addplusx = function (req, res) {
    //find current logged in guest should be primary guest
    Invite.findOne({primary: req.user._id}, function(err, invite) {
      if(invite) {
        //only allow on X amount of guest
        //TODO change "1" to a configurable number 
        if(invite.plusx.length < 1) {

          //create plus one in guest model
          var plusGuest = new Guest(req.body);
          plusGuest.save(function(err,plus) {

            if(err) {
              return res.send( {
                status: 'error',
                errors: utils.errors(err.errors)
              })
            }
          });
          //add plus one's id to invite
          invite.plusx.push(plusGuest);
          invite.save(function (err, invite) {
            if(err) {
              return res.send( {
                status: 'error',
                errors: utils.errors(err.errors)
              })
            }

            return res.send({
              status: 'success',
              plusx: invite.plusx
            });

          });
        } else {
          //if primary guest already has a plus one
          return res.send({
            status: 'error',
            errors: 'alreay registered your plus one'
          });
        }

      } else {
        return res.send({
          status: 'not registered, please registered first before add plus one'
        });
      }

    })
    

}

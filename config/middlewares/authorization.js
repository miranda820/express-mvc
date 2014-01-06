var mongoose = require('mongoose'),
    Guest = mongoose.model('Guest');

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    //req.session.returnTo = req.originalUrl
    return res.redirect('/')
  }
  next();
}

/*exports.requireAdmin = function(req, res,next) {
 if (!req.isAuthenticated()) {
    console.log('req.user', req)
    //req.session.returnTo = req.originalUrl
    // return res.render('/admin', {
    //   permission: false,
    //   error: "You have no permission to view this page"
    // })
    return res.redirect('/404')
  } else {
    Guest.find({_id: req.user.id}, function(err, user) {
      if(err){return next(err)}
      if(user) {
        return res.redirect('/admin')
      }

        
    })
  }

}*/

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/'+req.profile.id)
    }
    next()
  }
}

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization : function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/articles/'+req.article.id)
    }
    next()
  }
}

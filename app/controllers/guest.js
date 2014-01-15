var mongoose = require('mongoose'),
	utils = require('../../lib/utils'),
	path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	GuestList = mongoose.model('GuestList'),
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
exports.login = function(req, res, phase){
	if(req.user) {
		if(phase === 1) {
			res.redirect('/guest/register');
		} else {
			res.redirect('/details');
		}
	}
	res.render('home/index', {
			title: 'M&M are getting married!'
		});
};

exports.loginFrom = function (req, res) {
		res.render('login', {
				title: 'M&M are getting married!'
			});
}

/*exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/');
}*/

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};

exports.checkUser = function(req, res,next, guestId){
	//check is guest is registered
	Guest.findOne({guestId: guestId}, function(err, user) {

		 if(user) {
				//guest is registered ask to login
				return res.render('login',{
						email: req.body.email,
						renderLayout: false

					});
		 } else {
				//guest is not registered
				//
				return res.render('guest/register',{
						renderLayout: false,
						createPW: true,
						guestId: guestId
					} //TODO send json html back
				);

		 }
	})
};


exports.create = function (req, res) {
	//check against guestlist
	var guestList = req.profile
	var data = _.extend(req.body, 
			{ 	guestId: guestList._id, 
				email:guestList.email, 
				isPrimary:guestList.isPrimary,
				isParty:guestList.isParty
			}),
		guest = new Guest(data);

	guest.save(function(err, guest){
		if(err) {
			return res.send( {
				status: 'error',
				errors: utils.errors(err.errors),
				guest: guest
			})
		}

		req.logIn(guest, function(err) {

    		if (err) { return next(err); }
    		//return res.redirect('/guest/register');
    		return res.render('guest/register',{
				isPrimary:true,
				guestId: guestList._id
			})
		
		});
		//create password successfully
		/*if(guestList.isPrimary) {
			return res.render('guest/register',{
				isPrimary:true,
				guestId: guestList._id
			})//TODO add json html

		} else {
			return res.render('login',{
				title:'login'
			})//TODO add json html

		}*/
	});


}

exports.destination = function (req,res,phase){

	if (req.user.isPrimary) {
		if(phase === 1) {
			res.redirect('/guest/register');
		} else {
			res.redirect('/details');
		}
	} else {
		res.redirect('/details');
	}
}

exports.index = function(req, res) {
	return res.render('details/index', {
		title:'M and M are getting married!',
		guest: req.user
	})
}


exports.register = function(req, res) {
	Invite.findOne({primary: req.user.guestId}, function(err, invite) {
		if(err) {return next(err)}

		return res.render('guest/register', {
			title:'M and M are getting married!',
			isPrimary: req.user.isPrimary,
			guestId: req.user.guestId,
			invite: invite,
			renderLayout: true
		})

	})
	
}

exports.upload = function (req, res, next) {

	var tmp_path = req.files.picture.path;

	fs.readFile(tmp_path, function(err, data) {
		var pictureName = req.files.picture.name,
			pictureSize = req.files.picture.size;
		if(!pictureName) {

			return res.send({
				status:"error",
				message:"something went wrong, please upload image again"
			})
		} else {
			//picture should be jpg or png format and less than 3MB
			if (pictureName.match(/\.(jpg|png|jpeg)/) && pictureSize < 3 * 1024 * 1024) {

				var format = req.files.picture.type.replace('image/','.'),
					fileName = "full_"+req.user.guestId + format,
					newPath = path.resolve("./public/uploads/"),
					targetPath = newPath + '/' + fileName;

				console.log('targetPath', targetPath);
				fs.stat(newPath, function(err, stat) {
					if(!stat) {
						fs.mkdir(newPath, 0775, function (err) {
							 writeImage()
						})
						return
					}
					 writeImage()
				})		


				function writeImage() {
					fs.writeFile(targetPath, data, function (err) {
						if(err) {
							console.log(err)
							return next();
						}

						Guest.findOne({_id:req.user._id}, function (err, guest) {

							var user = _.extend(guest, {picture: fileName});

							console.log('-----user',user, fileName)
							user.save(function (err) {
								return res.send({
									status:"success",
									imageURL: "/public/uploads/fullsize/" + fileName
								})
							});
						})
					});
				}

			} else {

				return res.send({
					status:"error",
					message:"Please make sure the image is .jpg or .png and it's is less than 3MB"
				})
			}

		}


	})

}
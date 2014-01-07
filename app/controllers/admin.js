var mongoose = require('mongoose'),
	_ = require('underscore'),
	Invite = mongoose.model('Invite'),
	GuestList = mongoose.model('GuestList'),
	async = require('async'),
	utils = require('../../lib/utils');

function checkAdmin (req, res, adminCB, notAdminCB) {
	return adminCB();
	/*Guest.isAdmin(req.user.firstName, req.user.lastName, function(err, admin) {
		if(err) next (err);
		if(admin) {
			return adminCB();
		} else {
			return notAdminCB();
		}
	});*/


}

exports.index = function(req, res){

	async.parallel([
		//all the guests
		function(cb) {
			Guest.find({ isAdmin: false},function(err, guests) {
				if (err) return next(err);
				cb(null, guests);
			})
		},
		//total of plus one 
		function(cb) {
			Guest.getPlusx(function(err, guests) {
				if (err) return next(err);
				cb(null, guests.length);
			})
		},


		function(cb) {
			Invite.populateAll(function(err, invites) {
				if (err) return next(err);
				cb(null, invites);	
			})
		}

		], function(err, results){

			checkAdmin (req, res, function(){
				res.render('admin/index', {
						title: 'Admin',
						permission:true,
						guests: results[0],
						total: results[0].length,
						pluseoneTotal: results[1],
						invites: results[2],
						totalInvite :results[2].length
					});
				},

				function (){
					res.render('admin/index', {
							title: 'Admin',
							permission:false,
							error:'You have no permission to view this page'
					})
				}

			)			
	})

};

exports.signin = function (req,res){
	res.render('admin/login', {
				title: 'Admin login'
			});
}

exports.createGuest = function (req, res) {  
	checkAdmin (req, res, function() {
			var newUser = _.extend(req.body, {isPrimary : true}),
				guestList = new GuestList (newUser);

			guestList.save(function (err, guest) {

				if(err) {
					return res.send( {
						status: 'error',
						errors: utils.errors(err.errors),
						guest: guest
					})
				}

				return res.send({
					status: 'success',
					guest: guest,
				})

			})
		},
		function() {
			 res.send({
					status:"error",
					errors: "permission denied"
			})
		}
	)
};

exports.createAdmin = function(req,res) {

	checkAdmin (req, res, function(err, admin) {

			var data = _.extend(req.body, {isAdmin: true}),
				admin = new Guest(data);
			admin.save(function(err) {
				if(err) {
					return res.send({
						status:"error",
						errors: utils.errors(err.errors)
					})
				}

				return res.send({
					status:"success",
					admin:admin
				})

			});

		},
		function() {
			res.send({
					status:"error",
					errors: "permission denied"
			})
		}
	)
	
}


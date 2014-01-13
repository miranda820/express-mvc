var mongoose = require('mongoose'),
	_ = require('underscore'),
	Invite = mongoose.model('Invite'),
	GuestList = mongoose.model('GuestList'),
	Guest = mongoose.model('Guest'),
	async = require('async'),
	utils = require('../../lib/utils');


exports.index = function(req, res){

	async.parallel({
		//all the guests
		guestList: function(cb) {
			GuestList.find(function(err, guests) {
				if (err) return next(err);
				cb(null, guests);
			})
		},
		//total of plus one 
		pluseoneTotal: function(cb) {
			Guest.getPlusx(function(err, guests) {
				if (err) return next(err);
				cb(null, guests.length);
			})
		},


		invites: function(cb) {
			Invite.populateAll(function(err, invites) {
				if (err) return next(err);
				cb(null, invites);	
			})
		}

	}, function(err, results){

		res.render('admin/index', {
				title: 'Admin',
				permission:true,
				guestList: results.guestList,
				total: results.guestList.length,
				pluseoneTotal: results.pluseoneTotal,
				invites: results.invites,
				totalInvite :results.invites.length
			});

		}
	)


	
};

exports.signin = function (req,res){
	res.render('admin/login', {
				title: 'Admin login'
			});
}

exports.createGuest = function (req, res) {  

		var newUser = _.extend(req.body),
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
	
};

exports.createAdmin = function(req,res) {


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

	
}


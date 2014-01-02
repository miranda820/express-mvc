var mongoose = require('mongoose'),
	Invite = mongoose.model('Invite'),
	Guest = mongoose.model('Guest'),
	utils = require('../../lib/utils');

exports.index = function(req, res){
	Guest.find(function(err, guests){
	if(err) throw new Error(err);
	// res.render('admin/index', {
	//   title: 'Admin',
	//   guests: guests,
	//   total: guests.length
	// });
		var guests = guests;
	Guest.aggregate(
		{$unwind:'$name'},
		{ $project : {
			first : '$name.first' ,
			last : '$name.last'
	    }}, function(err, pluseone){
			console.log(pluseone);
	    	if(err) throw new Error(err);
		    res.render('admin/index', {
				title: 'Admin',
				guests: guests,
				total: guests.length,
				pluseoneTotal: pluseone
			});
		});
	});
	//	statics test
  	/*Guest.list(function(err, pluseone){
	    if(err) throw new Error(err);
	    console.log('render page');
	    res.render('admin/index', {
	      title: 'Admin',
	      //guests: guests,
	      //total: guests.length,
	      pluseoneTotal: pluseone
	    });
	})*/
};


exports.creatUser = function (req, res) {  

	var guest = new Guest (req.body);
	guest.save(function (err) {

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
}


var mongoose = require('mongoose'),
  Guest = mongoose.model('Guest');

exports.index = function(req, res){
 /* Guest.find(function(err, guests){
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
  });*/

  Guest.list(function(err, pluseone){
	    if(err) throw new Error(err);
	    console.log('render page');
	    res.render('admin/index', {
	      title: 'Admin',
	      //guests: guests,
	      //total: guests.length,
	      pluseoneTotal: pluseone
	    });
	})
};


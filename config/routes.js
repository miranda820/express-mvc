var util = require('util');

module.exports = function(app, mongoose){



	app.post('/api/guests', function (req, res) {  
		var guestModel = mongoose.model('Guest');
		var currentGuest = guestModel.find(
				{"name.first":req.body.firstName, "name.last": req.body.lastName},
				function(err, guests){
					if(err) throw new Error(err);

					if(guests.length > 0) {
						return res.send({	'error': true,
											'errorMessage': 'User exists'
										});				
					} else {
						createGuest()
					}
				}
			);


		function createGuest () {	

			var guest;
			console.log("POST: ");
			console.log(req.body);
			req.assert('firstName','can\'t be empty').notEmpty();
			req.assert('lastName','can\'t be empty').notEmpty(); 

			var errors = req.validationErrors();
			if (errors) {
				res.send('There have been validation errors: ' + util.inspect(errors), 400);
				return;
			}

			guest = new guestModel({
				name:[{first: req.body.firstName, last: req.body.lastName }]
			});

			guest.save(function (err) {
				if (!err) {
					return console.log("created");
				} else {
					return console.log(err);
				}
			});
			return res.send(guest);
		
		}
	}); 

	// route
	var home = require('../app/controllers/home'),
		admin = require('../app/controllers/admin');
	app.get('/', home.index);
	//app.get('/admin', admin.pluseone);
	app.get('/admin', admin.index);
	

};

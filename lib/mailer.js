
/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

var nodemailer = require('nodemailer');

exports.mail = function (config, recipient, subject, text, html, cd) {

	var smtpTransport = nodemailer.createTransport("SMTP",{
			service: config.service,
			auth: {
					user: config.user,
					pass: config.pass
			}
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: config.name + "<"+ config.user +">", // sender address
		to: recipient , // list of receivers
		subject: subject, // Subject line
		text: text, // plaintext body
		html: html
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(err, response){
		if(err){
				console.log(err);
				cd.error(err);
				/*return res.send({
					status:"error",
					message:"Humm somthing went wrong."
				});*/
		}else{
				console.log("Message sent: " + response.message);
				cd.success();
				/*return res.send({
					status:"sucess",
					message:"reset password link is sent to you"
				});*/
		}

		// if you don't want to use this transport object anymore, uncomment following line
		smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

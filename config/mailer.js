
module.exports = function (mailer) {
	// create reusable transport method (opens pool of SMTP connections)
	var smtpTransport = mailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: "miranda.mike.wang@gmail.com",
			pass: "google820"
		}
	});
}




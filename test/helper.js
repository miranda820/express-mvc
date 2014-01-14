
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	async = require('async'),
	GuestList = mongoose.model('GuestList'),
	Guest = mongoose.model('Guest'),
	Invite = mongoose.model('Invite');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
	async.parallel([
		function (cb) {
			GuestList.collection.remove(cb)
		},
		function (cb) {
			Guest.collection.remove(cb)
		},
		function (cb) {
			Invite.collection.remove(cb)
		}
	], done)
}

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
	message: {
		type: String,
		required: true,
		trim: true
	},
	date_created: {
		type: Date
		//default: Date.now()
	},
	creator: {
		type: String,
		ref: 'User',
		required: true
	}
});

module.exports = mongoose.model('Tweet', TweetSchema);
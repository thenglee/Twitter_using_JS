var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
	message: {
		type: String,
		required: true,
		trim: true
	},
	date_created: {
		type: Date,
		default: Date.now()
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'Tweet',
		required: true
	}
});

module.exports = mongoose.model('Tweet', TweetSchema);
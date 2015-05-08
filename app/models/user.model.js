var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crypto = require('crypto');


var UserSchema = new Schema({
	username: {
		type: String,
		//unique: true,
		required: 'Username is required',
		trim: true
	},
	name: {
		type: String,
		required: 'Name is required',
		trim: true
	},
	email: { 
		type: String,
		trim: true
	},
	password: String,
	bio: {
		type: String,
		trim: true
	},
	gravatar_link: String,
	following: [Number],
	followers: [Number],
	salt: String
});

UserSchema.pre('save', function(next){
	if (this.password){
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	this.gravatar_link = "";

	next();
});

UserSchema.methods.hashPassword = function(password){
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

var createGravatar = function(email){
	if (email){
		return crypto.createHash('md5').update(email).digest('hex');
	}
}

module.exports = mongoose.model('User', UserSchema);


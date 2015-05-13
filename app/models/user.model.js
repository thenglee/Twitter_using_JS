var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crypto = require('crypto');


var UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
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
		required: 'Email is required',
		trim: true,
		match: [/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i, 
		"Please enter a valid email address"]
	},
	password: {
		type: String,
		validate: [validatePasswordLength, 'Password must be at least 8 characters long']
	},
	bio: {
		type: String,
		trim: true
	},
	gravatar_link: String,
	following: [Number],
	followers: [Number],
	salt: String
});

function validatePasswordLength(password){
	return password.length == 8;
}

UserSchema.pre('save', function(next){
	if (this.password){
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

UserSchema.methods.hashPassword = function(password){
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password){
	return this.password === this.hashPassword(password);
};

module.exports = mongoose.model('User', UserSchema);


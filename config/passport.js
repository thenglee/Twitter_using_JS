var User = require('../app/models/user.model');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findOne({_id: id}, '-password -salt', function(err, user){
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({ passReqToCallback: true },
		function(req, username, password, done){
			User.findOne({ username: username }, function(err, user){
				if (err){
					//console.log(err.errors);
					return done(err);
				}

				if (!user){
					return done(null, false, req.flash('loginMessage', 'Unknown user'));
					//{ message: 'Unknown user'}
				}

				if (!user.authenticate(password)){
					return done(null, false, req.flash('loginMessage', 'Wrong password'));
				}

				return done(null, user);
			});
	}));

}



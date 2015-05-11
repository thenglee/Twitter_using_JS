var express = require('express');
var router = express.Router();

var User = require('../models/user.model');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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



router.route('/signup')
	.get(function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

router.route('/login')
	.get(function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	})
	.post(passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true 
	}));



router.route('/users')
	.post(function(req, res){

		var user = new User();

		user.username = req.body.username;
		user.name = req.body.name;
		user.email = req.body.email;
		user.password = req.body.password
		user.bio = req.body.bio;


		user.save(function(err){

			if (err) {
				//console.log(err.errors);
				//throw err;
				req.flash('signupMessage', 'Error saving user');
				return res.redirect('/signup');
			}

			res.status('201').send('User created');
		});

	});


router.route('/signin')
	.post(function(req, res){
		password.authenticate('local', function(err, user, info){
			if (err) {
				console.log(err.errors);
				return res.status(404).send('Error');
			}

			if (!user){
				console.log('!user');
				return res.status(404).send('No user found');
			}

			res.send('done');
		});
	});

module.exports = router;


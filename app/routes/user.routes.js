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


function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}


router.get('/', function(req, res){
	res.render('index.ejs', {
		userName: req.user ? req.user.username : ''
	});
});



router.route('/signup')
	.get(function(req, res){
		if (!req.user){
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		}else{
			return res.redirect('/');
		}
		
	});

router.route('/login')
	.get(function(req, res){
		if (!req.user){
			res.render('login.ejs', { message: req.flash('loginMessage') });
		}else{
			return res.redirect('/');
		}
		
	})
	.post(passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true 
	}));



router.route('/users')
	.post(function(req, res, next){
		if (!req.user){
			var user = new User();

			user.username = req.body.username;
			user.name = req.body.name;
			user.email = req.body.email;
			user.password = req.body.password
			user.bio = req.body.bio;


			user.save(function(err){

				if (err) {
					console.log(err);
					//console.log(err.errors);
					//throw err;
					req.flash('signupMessage', 'Error saving user');
					return res.redirect('/signup');
				}

				// req.login(user, function(err){
				// 	if (err) return next(err);

				// 	return res.redirect('/');
				// });
			});

		}else{
			return res.redirect('/');
		}

	});


module.exports = router;


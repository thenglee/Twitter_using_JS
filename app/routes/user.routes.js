var express = require('express');
var router = express.Router();

var User = require('../models/user.model');
var passport = require('passport');


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


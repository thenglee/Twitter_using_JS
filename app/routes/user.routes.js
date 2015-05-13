var express = require('express');
var router = express.Router();

var User = require('../models/user.model');
var passport = require('passport');

var getErrorMessage = function(err){
	var message = "";

	if (err.code){
		if (err.code == 11000 || err.code == 11001){
			return message = "Username already exists."
		}else{
			return message = "Something went wrong."
		}
	}else{
		for (var errName in err.errors){
			if (err.errors[errName].message){
				return message = err.errors[errName].message;
			}
		}
	}

	//return message;
}


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


router.get('/signup', function(req, res){
	if (!req.user){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	}else{
		return res.redirect('/');
	}
});


router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})


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


			if ((req.body.password !== "") && (req.body.confirm_password !== "")){
				if (req.body.password !== req.body.confirm_password){
					req.flash('signupMessage', 'Passwords do not match!');
					return res.redirect('/signup');
				}
			}else{
				req.flash('signupMessage', 'No password entered');
				return res.redirect('/signup');
			}


			user.password = req.body.password
			user.bio = req.body.bio;


			user.save(function(err){

				if (err) {
					console.log(err);
					//console.log(err.errors);
					//throw err;
					req.flash('signupMessage', getErrorMessage(err));
					return res.redirect('/signup');
				}

				req.login(user, function(err){
					if (err) return next(err);

					return res.redirect('/');
				});
			});

		}else{
			return res.redirect('/');
		}

	});


module.exports = router;


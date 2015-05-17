var User = require('../models/user.model');
var Tweet = require('../models/tweet.model');
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

// function isLoggedIn(req, res, next){
// 	if (req.isAuthenticated()){
// 		return next();
// 	}

// 	res.redirect('/');
// }

function getProfile(req){
	return {
		'name': req.user.name,
		'bio': req.user.bio,
		'numTweets': req.user.tweets_count,
		'numFollowing': req.user.following_count,
		'numFollowers': req.user.followers_count
	}
}

// var getTweets = function(username){
// 	var tweets = [];

// 	Tweet.find({'creator': username}, {}, { sort: { 'date_created': -1 }, limit: 30 }, function(err, docs){
// 		if (err){
// 			console.log(err);
// 			throw err;
// 		}

// 		//console.log(docs);
// 		//return docs;

// 		for (var i in docs){
// 			tweet = JSON.stringify(docs[i]);
// 			console.log(tweet);
// 		 	tweets.push(tweet);
// 		 }

// 		//  console.log('tweets: ' + tweets);

// 		 //return tweets;
// 		//return (JSON.stringify(docs));
// 		return tweets;
// 	});
// 	 console.log('tweets: ' + tweets);

// 	 //return tweets;
// }



exports.renderIndex = function(req, res){

	res.render('index.ejs', {
		userName: req.user ? req.user.username : '',
		message: req.flash('indexMessage'),
		profile: req.user ? getProfile(req) : null
		//tweets: req.user ? getTweets(req.user.username) : null
	});
};

exports.renderSignup = function(req, res){
	if (!req.user){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	}else{
		return res.redirect('/');
	}
};

exports.renderLogin = function(req, res){
	if (!req.user){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	}else{
		return res.redirect('/');
	}
};

exports.logout = function(req, res){
	req.logout();
	res.redirect('/');
};

exports.create = function(req, res){
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
		user.tweets_count = 0;
		user.following_count = 0;
		user.followers_count = 0;


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
};

exports.renderUserTimeline = function(req, res){
	if (req.user){
		res.render('user_timeline.ejs', {
			showUser: req.params.username,
			userName: req.user ? req.user.username : ''
		});
	}else{
		return res.redirect('/');
	}
};

exports.userProfile = function(req, res){
	if (req.user){

		User.find({'username': req.params.username}, 'username name bio tweets_count following_count followers_count', function(err, docs){
			if (err){
				console.log(err);
				res.status(404).json('Error finding user details');
			}

			return res.json(docs);
		});

	}else{
		return res.redirect('/');
	}
};

exports.whoToFollow = function(req, res){
	if (req.user){

		var following = req.user.following;

		following.push(req.user.username);

		User.find({'username': { $nin: following }}, 'username name bio', { limit: 30 },function(err, docs){
			if (err){
				console.log(err);
			} 

			//console.log(docs);

			//res.json(docs);

			res.render('who_to_follow.ejs',{
				to_follow_list: docs
			})
		});
	}else{	
		return res.redirect('/');
	}
};

exports.followUser = function(req, res){
	if (req.user){

		var current_user = req.user.username;
		var follow_user = req.params.username;

		User.findOneAndUpdate({'username': current_user},
			{ $addToSet: { 'following': follow_user }, $inc: { 'following_count': 1} }, function(err){
				if (err) throw err;
				
				User.findOneAndUpdate({'username': follow_user},
					{ $addToSet: { 'followers': current_user }, $inc: { 'followers_count': 1} }, function(err){
						if (err) throw err;

						res.sendStatus(200);
				});
		});

	}else{
		res.redirect('/');
	}
};












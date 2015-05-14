var express = require('express');
var router = express.Router();

var User = require('../models/user.model');
var Tweet = require('../models/tweet.model');


router.post('/tweets', function(req, res){
	if (req.user){
		var tweet = new Tweet();

		tweet.message = req.body.tweet;
		tweet.creator = req.user.id;

		tweet.save(function(err){
			if (err){
				console.log(err);
				req.flash('newTweetMessage', 'Error creating tweet');
				return res.redirect('/');
			}

			res.redirect('/');
		});

	}else{
		res.redirect('/');
	}
});

module.exports = router;
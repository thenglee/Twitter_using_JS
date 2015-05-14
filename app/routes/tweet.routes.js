var express = require('express');
var router = express.Router();

var User = require('../models/user.model');
var Tweet = require('../models/tweet.model');


router.post('/tweets', function(req, res){
	if (req.user){
		var tweet = new Tweet();

		tweet.message = req.body.tweet;
		//tweet.creator = req.user.id;
		tweet.creator = req.user.username;
		tweet.date_created = Date.now();

		tweet.save(function(err){
			if (err){
				console.log(err);
				req.flash('indexMessage', 'Error creating tweet');
				return res.redirect('/');
			}

			res.redirect('/');
		});

	}else{
		res.redirect('/');
	}
});


router.get('/tweets/:username', function(req, res){
	if (req.user){

		Tweet.find({'creator': req.params.username}, {}, { sort: { 'date_created': -1 }, limit: 30 }, function(err, docs){
			if (err){
				console.log(err);
				req.flash('indexMessage', 'Error finding tweets');
				return res.redirect('/');
			}

			res.json(docs);
		});

	}else{
		res.redirect('/');
	}
});


module.exports = router;
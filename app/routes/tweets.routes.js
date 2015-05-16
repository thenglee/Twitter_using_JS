var express = require('express');
var router = express.Router();
var tweets = require('../controller/tweets.controller');

router.post('/tweets', tweets.create);

router.route('/tweets/:tweet_id')
	.delete(tweets.delete);

router.get('/tweets/:username', tweets.getTweetsByUser);

module.exports = router;
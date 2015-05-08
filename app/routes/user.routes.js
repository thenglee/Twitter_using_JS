var express = require('express');
var router = express.Router();

var User = require('../models/user.model');

router.route('/')
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
				throw err;
			}

			res.status('201').send('User created');
		});

	});

module.exports = router;


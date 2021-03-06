var express = require('express');
var router = express.Router();
var users = require('../controller/users.controller');
var passport = require('passport');


router.get('/', users.renderIndex);

router.get('/signup', users.renderSignup);

router.route('/login')
	.get(users.renderLogin)
	.post(passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true 
	}));

router.get('/logout', users.logout);

router.post('/users', users.create);

router.put('/edit_profile', users.updateProfile)

router.get('/users/:username', users.renderUserTimeline);

router.get('/users/profile/:username', users.userProfile);

router.get('/edit_profile', users.renderEditProfile);

router.get('/whotofollow', users.whoToFollow);

router.put('/users/follow/:username', users.followUser);

router.put('/users/unfollow/:username', users.unfollowUser);

router.get('/users/:username/following', users.userFollowing);

router.get('/users/:username/followers', users.userFollowers);

module.exports = router;


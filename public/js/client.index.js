$(function(){

	$.ajax({
		type: 'GET',
		url: '/tweets/' + $('#user-name').data('username')
	}).success(function(tweets){
		appendToTweetList(tweets);
	});


	function appendToTweetList(tweets){

		$('.tweet-list').empty();

		var list = [];
		var content, tweet;

		for (var i in tweets){
			tweet = tweets[i];

			content = '<a href="/users/' + tweet.creator + '">' + tweet.creator + 
						'</a>: ' + tweet.message + ' <a href="#" data-tweet="'+ tweet._id + '">Delete</a>' ;
			list.push($('<li>', { html: content }));
		}

		$('.tweet-list').append(list);
	}


	$('.tweet-list').on('click', 'a[data-tweet]', function(event){
		if(!confirm('Are you sure?')){
			return false;
		}

		var target = $(event.currentTarget);

		$.ajax({
			type: 'DELETE',
			url: '/tweets/' + target.data('tweet')
		}).done(function(){
			target.parents('li').remove();
			var tweets_count = parseInt($('#tweets_count').text());

			tweets_count -= 1;

			$('#tweets_count').text(tweets_count);


		});
	});


	$('#tweets').on('click', function(event){

		$.ajax({
			type: 'GET',
			url: '/tweets/' + $('#user-name').data('username')
		}).success(function(tweets){
			appendToTweetList(tweets);
			$('#tweets_count').text(tweets.length);
		});

		if (!($('#tweets').hasClass('active'))){
			$('#tweets').addClass('active');
		}

		$('#following').removeClass('active');
		$('#followers').removeClass('active');


		$('.following-list').hide();
		$('.followers-list').hide();
		$('.tweet-list').show();

	});


	$('#following').on('click', function(event){

		$.ajax({
			type: 'GET',
			url: '/users/' + $('#user-name').data('username') + '/following'
		}).success(function(users){
			appendToFollowingList(users);
			$('#following_count').text(users.length);
		});


		if (!($('#following').hasClass('active'))){
			$('#following').addClass('active');
		}

		$('#tweets').removeClass('active');
		$('#followers').removeClass('active');

		$('.followers-list').hide();
		$('.tweet-list').hide();
		$('.following-list').show();

	});

	function appendToFollowingList(users){

		$('.following-list').empty();

		var content, user;

		for (var i in users){
			user = users[i];

			content = '<div class="user" id="' + user.username + '"><a href="/users/' + 
					user.username + '">' + user.username + '</a> &nbsp;' +
					'<span>' + user.name + '</span> &nbsp;' +
					'<span>' + user.bio + '</span> &nbsp;' + 
					'<button class="unfollow" data-username="' + user.username + '">Following</button></div>';

			$('.following-list').append(content);
		}
		
	}


	$('#followers').on('click', function(event){

		$.ajax({
			type: 'GET',
			url: '/users/' + $('#user-name').data('username') + '/followers'
		}).success(function(users){
			appendToFollowersList(users);
			$('#followers_count').text(users.length);
		});

		if (!($('#followers').hasClass('active'))){
			$('#followers').addClass('active');
		}

		$('#tweets').removeClass('active');
		$('#following').removeClass('active');

		$('.tweet-list').hide();
		$('.following-list').hide();
		$('.followers-list').show();

	});


	function appendToFollowersList(users){

		$('.followers-list').empty();

		var content, btnMessage, btnClass, user;

		for (var i in users){
			user = users[i];

			if (user.isFollowed){
				btnMessage = "Following";
				btnClass = "unfollow";
			}else{
				btnMessage = "Follow";
				btnClass = "follow";
			}

			content = '<div class="user" id="' + user.username + '"><a href="/users/' + 
					user.username + '">' + user.username + '</a> &nbsp;' +
					'<span>' + user.name + '</span> &nbsp;' +
					'<span>' + user.bio + '</span> &nbsp;' + 
					'<button class="' + btnClass + '" data-username="' + user.username + '">' + btnMessage + '</button></div>';

			$('.followers-list').append(content);

		}

	}

	$('.panel').on('click', '.follow', function(event){
		var target = $(event.currentTarget);
		var username = target.data('username');

		$.ajax({
			type: 'PUT',
			url: '/users/follow/' + username
		}).done(function(){
			target.removeClass('follow').addClass('unfollow');
			target.text('Following');
		});
	});

	$('.panel').on('click', '.unfollow', function(event){
		var target = $(event.currentTarget);
		var username = target.data('username');

		$.ajax({
			type: 'PUT',
			url: '/users/unfollow/' + username
		}).done(function(){
			target.removeClass('unfollow').addClass('follow');
			target.text('Follow');
		});
	});


	$('.panel').on('mouseenter', '.unfollow', function(){
		$(this).text('Unfollow');
	});

	$('.panel').on('mouseleave', '.unfollow', function(){
		$(this).text('Following');
	});


});
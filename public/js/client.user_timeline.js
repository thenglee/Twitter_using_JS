$(function(){

	$.ajax({
		type: 'GET',
		url: '/users/profile/' + $('#show-user').data('showuser')
	}).success(function(user){
		if (user.length > 0){
			displayUserProfile(user);
		}else{
			$('.user-profile').append('<p>No user found!</p>')
		}
	});

	function displayUserProfile(user){
		var content = '<h3>' + user[0].username + '</h3>' +
						'<h4>' + user[0].name + '</h4>' +
						'<p>' + user[0].bio +'</p>' + 
						'Tweets: <span id="tweets">' + user[0].tweets_count + '</span> | ' +
						'Following: <span id="following">' + user[0].following_count + '</span> | ' +
						'Followers: <span id="followers">' + user[0].followers_count + '</span> '

		$('.user-profile').append(content);
	}


	$.ajax({
		type: 'GET',
		url: '/tweets/' + $('#show-user').data('showuser')
	}).success(function(tweets){
		appendToList(tweets);
	});


	function appendToList(tweets){
		var list = [];
		var content, tweet;

		for (var i in tweets){
			tweet = tweets[i];

			if (($('#user-name').data('username')) == ($('#show-user').data('showuser'))){
				content = '<a href="/users/' + tweet.creator + '">' + tweet.creator + 
						'</a>: <a href="/tweets/' + tweet.creator + '/' + tweet._id + '">' + 
						tweet.message + '</a> <a href="#" data-tweet="'+ tweet._id + '">Delete</a>' ;
			}else{
				content = '<a href="/users/' + tweet.creator + '">' + tweet.creator + 
						'</a>: <a href="/tweets/' + tweet.creator + '/' + tweet._id + '">' + 
						tweet.message + '</a>';
			}

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

			var tweets_count = parseInt($('#tweets').text());

			tweets_count -= 1;

			$('#tweets').text(tweets_count);
		});

	});

});
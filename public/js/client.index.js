$(function(){

	$.ajax({
		type: 'GET',
		url: '/tweets/' + $('.tweet-list').data('username')
	}).success(function(tweets){
		appendToList(tweets);
	});


	function appendToList(tweets){
		var list = [];
		var content, tweet;

		for (var i in tweets){
			tweet = tweets[i];

			//if ($('#username').data('username'))

			content = '<a href="/users/' + tweet.creator + '">' + tweet.creator + 
						'</a>: <a href="/tweets/' + tweet.creator + '/' + tweet._id + '">' + 
						tweet.message + '</a> <a href="#" data-tweet="'+ tweet._id + '">Delete</a>' ;
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
		});
	});

});
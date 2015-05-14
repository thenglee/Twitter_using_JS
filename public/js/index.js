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
			content = tweet.creator + ': ' + tweet.message;
			list.push($('<li>', { html: content }));
		}

		$('.tweet-list').append(list);
	}

});
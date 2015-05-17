$(function(){

	
	$('.user').on('click', '.follow', function(event){
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

	$('.user').on('click', '.unfollow', function(event){
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


	$('.user').on('mouseenter', '.unfollow', function(){
		$(this).text('Unfollow');
	});

	$('.user').on('mouseleave', '.unfollow', function(){
		$(this).text('Following');
	});

});
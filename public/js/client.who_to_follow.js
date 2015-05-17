$(function(){

	
	$('.user').on('click', 'button[data-username]', function(event){
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

});
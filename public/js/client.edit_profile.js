$(function(){

	$('form').on('submit', function(event){
		event.preventDefault();

		$('.message').text();

		$.ajax({
			url: '/edit_profile',
			type: 'PUT',
			data: $('form').serialize()
		}).done(function(){
			$('.message').text('Your changes has been saved.')
		});
	});

});
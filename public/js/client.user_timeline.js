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
						'<p>' + user[0].bio +'</p>';

		$('.user-profile').append(content);

	}

});
function postData(postType,data,lambda = function(){}) {
	//make the AJAX call
	$.ajax({
		url: '/' + postType,
		type: 'POST',
		data: data,
		complete: function(response){
			if(lambda != undefined){
				lambda(response.responseJSON);
			}
		}
	});
}

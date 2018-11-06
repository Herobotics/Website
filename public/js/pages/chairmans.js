function changePage(pageName){
  console.log(pageName);
}

$(document).ready(function(){
  postData('getPageData', {page: 'chairmans.json'}, function(data){
    console.log(data);
    
  });
});

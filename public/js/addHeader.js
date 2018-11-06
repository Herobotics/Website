$(document).ready(function(){
  var header = document.createElement("div");

  $(header).load("/html/header.html");
  document.body.insertBefore(header, document.body.firstChild);
});

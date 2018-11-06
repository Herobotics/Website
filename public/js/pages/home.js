$(document).ready(function(){
  postData("getPageData", {page: 'home.json'}, function(data){
    var opening = document.getElementById('opening').children;
    opening[0].innerHTML = data.Opening.Name;
    opening[1].innerHTML = data.Opening["Chairmans Theme"];
    opening[2].innerHTML = data.Opening.Description;

    var links = document.getElementById('links').children;
    for(var i = 0; i < links.length; i++){
      var link = links[i];
      var linkData = data.Links.Sections[i];
      var title = document.createElement('h2');
      title.innerHTML = linkData.Title;
      var description = document.createElement('p');
      description.innerHTML = linkData.Description;
      var readMore = document.createElement('a');
      readMore.href = "/" + linkData.Page;
      readMore.innerHTML = "READ MORE"
      readMore.classList.add('button');

      link.appendChild(title);
      link.appendChild(description);
      link.appendChild(document.createElement('br'));
      link.appendChild(readMore);
    }

    var outreach = document.getElementById("outreachCategories");
    for(var i in data.Outreach.Categories){
      var category = data.Outreach.Categories[i];
      var button = document.createElement('div');
      button.onclick = function(){getImages(this.innerHTML)};
      button.innerHTML = category;
      outreach.appendChild(button);
    }

    var contactUs = document.getElementById("contactUs");
    contactUs.children[1].innerHTML = data["Contact Us"].Text;
  });
});

function getImages(category){
  //TODO: 
  console.log(category);
}

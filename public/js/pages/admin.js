
function drawObject(value, location){
  //If it is an array draw the array
  if(Array.isArray(value)){
    //create the body of the array
    var body = document.createElement("div");
    location.appendChild(body);

    body.classList.add("array");

    //create the componetns of the arrays
    //create the value container
    var values = document.createElement("div");
    body.appendChild(values);

    //propogate the components of the array into the values
    for(var i in value){
      //Create a container to hold the value and its pop button
      var componentContainer = document.createElement("div");
      values.appendChild(componentContainer);

      //Put the value into the array
      drawObject(value[i], componentContainer)

      //Create the pop button
      var popButton = document.createElement("button");
      componentContainer.appendChild(popButton);

      popButton.innerHTML = "Remove Value";
      popButton.onclick = function(){removeFromArray(this)};
    }

    //create the button to append the array
    var appendButton = document.createElement("button");
    body.appendChild(appendButton);

    appendButton.onclick = function(){addToArray(this)};

    appendButton.innerHTML = "Add new value";
  }
  else if(typeof value == "object"){
    //create the body of the object
    var body = document.createElement("div");
    location.appendChild(body);

    body.classList.add("object");

    for(var name in value){
      //Create a container to hold each value
      var container = document.createElement("div");
      body.appendChild(container);

      //Create a name for each value
      var nameElement = document.createElement("span");
      container.appendChild(nameElement);

      //Set the name
      nameElement.innerHTML = name;

      //Put the child object in this container
      drawObject(value[name], container);
    }
  }
  else if(typeof value == "string" || typeof value == "number"){
    var input = document.createElement("input");
    location.appendChild(input);

    input.value = value;
  }
  else{
    console.log("Oof")
  }
}

function removeFromArray(caller){
  var index = caller.parentNode;
  var array = index.parentNode;

  if(array.childNodes.length == 1){
    alert("I'm sorry Dave I can't do that...\nBut seriously you need to leave atleast one value so that we have a template for the next one that will be made.");
  }
  else{
    array.removeChild(index);
  }
}

function addToArray(caller){
  //Get values based on the button
  var array = caller.parentNode.childNodes[0];
  var template = array.childNodes[0].childNodes[0];

  //Create a container for the new value and its pop button
  var container = document.createElement("div");
  array.appendChild(container);

  //Propogate the values
  drawObject(toJSON(template),container);

  //Create the pop button
  var popButton = document.createElement("button");
  container.appendChild(popButton);

  popButton.innerHTML = "Remove Value";
  popButton.onclick = function(){removeFromArray(this)};
}

function changePage(page){
  document.getElementById('pageTitle').innerHTML = page;

  postData('getPageData',{page: page + '.json'}, function(pageData){
    var pageEditor = document.getElementById('pageEditor');

    pageEditor.removeChild(pageEditor.lastChild);

    drawObject(pageData, pageEditor);
  });
};

function toJSON(object){
  console.log();
  if(object.tagName == 'INPUT'){
    return object.value;
  }
  else if(Array.from(object.classList).includes('array')){
    var values = [];
    var childern = object.childNodes[0].childNodes;
    for(var i = 0; i < childern.length; i++){
      var child = childern[i].childNodes[0];
      values.push(toJSON(child));
    }

    return values;
  }
  else if(Array.from(object.classList).includes('object')){
    var values = {};

    var childern = object.childNodes;
    for(var i = 0; i < childern.length; i++){
      var child = childern[i].childNodes;
      values[child[0].innerHTML] = toJSON(child[1]);
    }

    return values;
  }
}

function savePage() {
  var pageEditor = document.getElementById('pageEditor');

  var data = {
    page: document.getElementById('pageTitle').innerHTML,
    data: toJSON(pageEditor.lastChild)
  }

  postData('setPageData', data, function(data){
    console.log('saved')
  });
}

$(document).ready(function(){
  postData('getPages',{}, function(data){
    var pages = data.pages;
    var pageList = document.getElementById('pages');
    for(var i in pages){
      pageList.innerHTML += '<a href="#" onclick="changePage(\'' + pages[i] + '\');return false">' + pages[i] + '</a></br>'
    };
  });
});

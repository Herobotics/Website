$(document).ready(function(){
  postData("getPageData", {page: 'aboutUs.json'}, function(data){

    document.getElementById('about').innerHTML = data.Descriptions.about;

    document.getElementById('mission').innerHTML = data.Descriptions.mission;

    document.getElementById('subTeams').innerHTML = data.Descriptions.subTeams;

    document.getElementById('tournamentHistory').innerHTML = data.Descriptions.tournamentHistory;

    //Get the awards
    var awards = data.Awards;
    //Sort the award lists
    awards = awards.sort(function(a, b){
      return b.year - a.year;
    });

    for(var i in data.Awards){
      var yearContainer = document.createElement('div');
      yearContainer.classList.add('year');

      var year = document.createElement('h2');
      yearContainer.appendChild(year);

      year.innerHTML = data.Awards[i].year;

      for(var j in data.Awards[i].awards){
        var award = data.Awards[i].awards[j];

        var awardContainer = document.createElement('div');
        yearContainer.classList.add('award');
        yearContainer.appendChild(awardContainer);

        var name = document.createElement('h4');
        awardContainer.appendChild(name);

        name.innerHTML = award.name;

        var description = document.createElement('div');
        awardContainer.appendChild(description);

        description.innerHTML = award.description;
      }

      if(i < 4){
        //Awards from the past 4 years
        document.getElementById('awardsListStart').appendChild(yearContainer);
      }
      else{
        //All other awards
        document.getElementById('awardsListEnd').appendChild(yearContainer);
      }
    }
  });
});

function showListEnd(){
  var button = document.getElementById('showButton');

  if(button.innerHTML == 'SHOW MORE'){
    button.innerHTML = 'SHOW LESS';
    document.getElementById('awardsListEnd').style.display = "block";
  }
  else{
    button.innerHTML = 'SHOW MORE';
    document.getElementById('awardsListEnd').style.display = "none";
  }
}

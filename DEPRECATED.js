// currently working on recently played and color chang for rank

// VERY HORRIBLE STYLE AND CODE I KNOW. this was made in the span of 2 months of on and off with long breaks in between, so you can get why it's so messy


if(window.location.pathname.indexOf("summoner/userName=") !== -1) {
    var icon = document.getElementsByClassName("Navigation")[0].children[1].children[0].children[0].children[0].children[1].innerHTML;
    var divOne = document.createElement("div");
    var divTwo = document.createElement("div");
    var divThree = document.createElement("div");
    var input = document.createElement("input");
    var divFour = document.createElement("div");
    var divFive = document.createElement("div");
    var script = document.createElement("script");
    var loadButton = document.createElement("button");
    var link = document.createElement("link");
    
    document.getElementsByTagName("head")[0].appendChild(link).setAttribute("id", "fontAwesome");
    document.getElementById("fontAwesome").setAttribute("href", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    document.getElementById("fontAwesome").setAttribute("rel", "stylesheet");
    document.getElementsByClassName("Buttons")[0].appendChild(loadButton).setAttribute("id", "loadAllButton");
    document.getElementById("loadAllButton").setAttribute("class", "Button SemiRound White");
    document.getElementById("loadAllButton").innerHTML = "Load All Games";
    document.getElementById("loadAllButton").addEventListener("click", loadAllGames);
    
    document.getElementsByClassName("Navigation")[0].children[1].children[0].children[0].children[0].children[0].setAttribute("id", "originalSearch")
    document.getElementsByClassName("Navigation")[0].children[1].children[0].children[0].children[1].setAttribute("id", "recList")
    document.getElementsByClassName("Navigation")[0].children[1].children[0].setAttribute("style", "float: right");
    document.getElementsByClassName("Navigation")[0].children[1].appendChild(divOne).setAttribute("class", "Action");
    document.getElementsByClassName("Navigation")[0].children[1].children[1].setAttribute("style", "float: right");
    document.getElementsByClassName("Navigation")[0].children[1].children[1].appendChild(divTwo).setAttribute("class", "ChampionMatchSearchWrap");
    document.getElementsByClassName("Navigation")[0].children[1].children[1].children[0].appendChild(divThree).setAttribute("class", "Header");
    document.getElementsByClassName("Navigation")[0].children[1].children[1].children[0].appendChild(divFive).setAttribute("id", "customContent");
    document.getElementById("customContent").setAttribute("class", "Content");
    
    document.getElementsByClassName("Navigation")[0].children[1].children[1].children[0].children[0].innerHTML = "<input type='text' class='Input' placeholder='Summoner Search' id='summonerNameInput'><div class='Action'>" + icon + "</div>"
    
    document.getElementsByClassName("Navigation")[0].children[1].appendChild(divFour).setAttribute("id", "readyOrNot");
    document.getElementById("readyOrNot").setAttribute("class", "Action");
    
    
    document.getElementById("customContent").innerHTML = "<ul class='SelectMatchChampionList short'><li class='Item Recent'><div class='Header'>Recently Played</div><div class='Content'><ul class='ChampionList' id='recently-played-summoners'></ul></div></li><li class='Item All'><div class='Header'>Summoners</div><div class='Content'><ul class='ChampionList' id='full-list-summoners'></ul></div></li></ul>"
    
    setTimeout(start, 100);
    function addOneDiv() {
        document.getElementsByClassName("GameMoreButton")[0].children[0].click();
    }
    
    function loadAllGames() {
        addOneDiv();
        document.getElementById("readyOrNot").innerHTML = "<i style='margin:5px;color:red;' class='fa fa-times-circle-o fa-2x' aria-hidden='true'></i>"
        var target = document.getElementsByClassName("GameItemList")[0].parentElement;
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
              if(document.getElementsByClassName("GameMoreButton")[0] == undefined) {
                  observer.disconnect();
                  start();
              }
              addOneDiv();
          });
        });
        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
    }
    
    
    function start() {
        document.getElementById("readyOrNot").innerHTML = "<i style='margin:5px;color:green;' class='fa fa-check-circle-o fa-2x' aria-hidden='true'></i>"
        
        var c = 0;
        var numberOfGames = document.getElementsByClassName("FollowPlayers").length;
        var userSummonerName = (document.getElementsByClassName("Name")[0].innerHTML).toLowerCase();
        var summonerNameList = [];
        var gamesPlayedWith = [];
        var uniqueSummonerNameList = [];
        var recentlyPlayedList = [];
        document.getElementById("summonerNameInput").onclick = function(event) {
            document.getElementById("customContent").style.display = "block";
            bankChange();
        }
        /// IGNORE THIS CODE PLIS. this is probably the worst coding ive ever done in js and i did this ONLY to sync the 2 search bars in the weirdest way possible. i will fix later
        document.onclick = function(e) {
            var rect = document.getElementById("summonerNameInput").getBoundingClientRect();
            var mouseX = e.clientX;
            var mouseY = e.clientY;
            if(mouseY>rect.top && mouseY<rect.bottom + 340 && mouseX>rect.left-157 && mouseX<rect.right+30) {
            } else {
                document.getElementById("customContent").style.display = "none";
            }
        }
        document.getElementById("originalSearch").onclick = function(event) {
            document.getElementById("customContent").style.display = "none";
        }
        //yes this onmousedown is made to sync with the onblur... plis luv me
        document.getElementById("summonerNameInput").onmousedown = function(event) {
            document.getElementById("recList").style.display = "none";
        }
        for(var v=0; v<document.getElementsByClassName("Body")[0].children.length; v++) {
            recentlyPlayedList.push(document.getElementsByClassName("Body")[0].children[v].children[0].children[0].innerHTML);
        }
        for(var o=0; o<recentlyPlayedList.length; o++) {
            document.getElementById("recently-played-summoners").innerHTML = document.getElementById("recently-played-summoners").innerHTML + "<li class='Item'><a class='Link'>" + recentlyPlayedList[o] + "</a></li>";
        }

        for(var p=0; p<recentlyPlayedList.length; p++) {
                    document.getElementById("recently-played-summoners").children[p].children[0].addEventListener("click", function(){document.getElementById("summonerNameInput").value = $(this).html();search();bankChange();document.getElementById("customContent").style.display = "none";})
                    document.getElementById("recently-played-summoners").children[p].children[0].style.cursor = "pointer";
        }
        for(var z=0; z<numberOfGames; z++) {
            var teamCount = document.getElementsByClassName("FollowPlayers")[z].children.length;
            for(var y=0; y<teamCount; y++) {
                var playerCount = document.getElementsByClassName("FollowPlayers")[z].children[y].children.length;
                for(var x=0; x<playerCount; x++) {
                    var tempSummonerName = document.getElementsByClassName("FollowPlayers")[z].children[y].children[x].children[1].children[0].innerHTML.toLowerCase();
                    if(tempSummonerName != userSummonerName) {
                        summonerNameList.push(document.getElementsByClassName("FollowPlayers")[z].children[y].children[x].children[1].children[0].innerHTML);
                    }
                }
            }
            if(z == numberOfGames-1) {
                $.each(summonerNameList, function(i, el){
                    if($.inArray(el, uniqueSummonerNameList) === -1) uniqueSummonerNameList.push(el);
                });
            }

        } 
        document.getElementById("summonerNameInput").onkeydown = function(event) {
            if(event.keyCode==13) {
                search();
            }
        }
        function search() {
            
            for(var h=0; h<numberOfGames; h++) {
                document.getElementsByClassName("GameItemWrap")[h].setAttribute("style", "display:block");
            }
            var summonerName = document.getElementById("summonerNameInput").value.toLowerCase();
            for(var i=0; i<numberOfGames; i++) {
                var teamCount = document.getElementsByClassName("FollowPlayers")[i].children.length;
                for(var a=0; a<teamCount; a++) {
                    var playerCount = document.getElementsByClassName("FollowPlayers")[i].children[a].children.length;
                    for(var n=0; n<playerCount; n++) {
                        if(document.getElementsByClassName("FollowPlayers")[i].children[a].children[n].children[1].children[0].innerHTML.toLowerCase() == summonerName) {
                            gamesPlayedWith.push(i);
                            document.getElementsByClassName("FollowPlayers")[i].children[a].children[n].children[1].children[0].setAttribute("style", "color: black")
                        }
                    }
                }
            }
            for(var b=0; b<numberOfGames; b++) {
                if(b == gamesPlayedWith[c]) {
                    c++
                } else {
                    document.getElementsByClassName("GameItemWrap")[b].setAttribute("style", "display:none");
                }
            }
        }
        setTimeout(bankChange, 100);
        document.getElementById("summonerNameInput").onkeydown = function(event) {
            if(event.keyCode == 8) {
                setTimeout(bankChange, 10);
            }
            
        }
        document.getElementById("summonerNameInput").onkeypress = function(event) {
            setTimeout(bankChange, 10);
            
        }
        function bankChange() {
            var summonerName = document.getElementById("summonerNameInput").value.toLowerCase();
            var fullList = document.getElementById("full-list-summoners");
            var searchBank = [];
            fullList.innerHTML = "<li class='Item show'><a class='Link'>Show All Summoners</a></li>";
            // get ready to test out. just moved the addeventlistener down, should work.
            if(document.getElementById("summonerNameInput").value != "") {
                document.getElementById("customContent").style.display = "block";
                for(var f=0; f<uniqueSummonerNameList.length; f++) {
                    if(summonerName.substring(0, summonerName.length).toLowerCase() == uniqueSummonerNameList[f].substring(0, summonerName.length).toLowerCase()) {
                        searchBank.push(uniqueSummonerNameList[f]);
                    }
                }
                
                for(var g=0; g<searchBank.length; g++) {
                    fullList.innerHTML = fullList.innerHTML + "<li class='Item show'><a class='Link'>" + searchBank[g] + "</a></li>";
                }
                // weird bug not letting me combine these 2... will fix
                for(var s=1; s<=searchBank.length; s++) {
                    document.getElementById("full-list-summoners").children[s].children[0].addEventListener("click", function(){document.getElementById("summonerNameInput").value = $(this).html();search();bankChange();document.getElementById("customContent").style.display = "none";})
                    document.getElementById("full-list-summoners").children[s].children[0].style.cursor = "pointer";
                }
                document.getElementById("full-list-summoners").children[0].children[0].addEventListener("click", function(){for(var m=0; m<numberOfGames; m++) {document.getElementsByClassName("GameItemWrap")[m].setAttribute("style", "display:block");document.getElementById("customContent").style.display = "none";document.getElementById("summonerNameInput").value = "";for(var i=0; i<numberOfGames; i++) {
                var teamCount = document.getElementsByClassName("FollowPlayers")[i].children.length;
                for(var a=0; a<teamCount; a++) {
                    var playerCount = document.getElementsByClassName("FollowPlayers")[i].children[a].children.length;
                    for(var n=0; n<playerCount; n++) {
                        if(document.getElementsByClassName("FollowPlayers")[i].children[a].children[n].children[1].children[0].innerHTML.toLowerCase() == summonerName) {
                            document.getElementsByClassName("FollowPlayers")[i].children[a].children[n].children[1].children[0].setAttribute("style", "color: #555")
                        }
                    }
                }
            }}})
                
                document.getElementById("full-list-summoners").children[0].children[0].style.cursor = "pointer";
            } else {
                fullList.innerHTML = "";
                fullList.innerHTML = "<li class='Item show'><a class='Link'>Show All Summoners</a></li>";
                document.getElementById("full-list-summoners").children[0].children[0].addEventListener("click", function(){for(var m=0; m<numberOfGames; m++) {document.getElementsByClassName("GameItemWrap")[m].setAttribute("style", "display:block");document.getElementById("customContent").style.display = "none";document.getElementById("summonerNameInput").value = "";for(var i=0; i<numberOfGames; i++) {
                var teamCount = document.getElementsByClassName("FollowPlayers")[i].children.length;
                for(var a=0; a<teamCount; a++) {
                    var playerCount = document.getElementsByClassName("FollowPlayers")[i].children[a].children.length;
                    for(var n=0; n<playerCount; n++) {
                        if(document.getElementsByClassName("FollowPlayers")[i].children[a].children[n].children[1].children[0].innerHTML.toLowerCase() == summonerName) {
                            document.getElementsByClassName("FollowPlayers")[i].children[a].children[n].children[1].children[0].setAttribute("style", "color: #555")
                        }
                    }
                }
            }}})
                
                document.getElementById("full-list-summoners").children[0].children[0].style.cursor = "pointer";
                
            }
        }
        function reset() {
            for(var m=0; m<numberOfGames; m++) {
                document.getElementsByClassName("GameItemWrap")[m].setAttribute("style", "display:block");
            }
        }
    }
    function addListeners() {
        for(var p=0; p<document.getElementsByClassName("MatchDetail").length; p++) {
            document.getElementsByClassName("MatchDetail")[p].addEventListener("click", colorChange());
            added++;
        }
    }
    //test, not used
    /*
    function colorChange() {
        console.log("si");
        var ranks = ["bronze", "silver", "gold", "platinum", "diamond", "master", "challenger"];
        var colors = ["brown", "gray", "yellow", "#2ec3b4", "dodgerblue", "hotpink", "hotpink"];
        for(var t=0; t<3; t=t+2) {
            for(var y=0; y<$(this).parent().parent().parent().parent().children().last().children([0]).children([t]).children.([2]).children().length(); y++) {
                for(var u=0; u<ranks.length; u++) {
                    var playerRank = $(this).parent().parent().parent().parent().children().last().children([0]).children([t]).children.([2]).children([y]).children().last().html().toLowerCase();
                    if(playerRank.indexOf(ranks[u]) !== -1) {
                        $(this).parent().parent().parent().parent().children().last().children([0]).children([t]).children.([2]).children([y]).children().last().css("color" : "" + colors[u]);
                    }
                }
            }
        }
    }
    */  
    
}

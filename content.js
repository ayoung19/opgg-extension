var link = document.createElement("link");
var button = document.createElement("button");
var search = document.querySelector(".Navigation .Action").cloneNode(true);
var listRecent = search.querySelector(".Recent ul");
var listAll = search.querySelector(".All ul");

var map = {};

// fix user name
var user = document.querySelector(".Name").innerText;

if(user[0] == "[" && user[user.length - 1] == "]") {
    user = user.replace("[", "");
    user = user.replace("]", "");
}

addElements();
setTimeout(load, 100);

function load() {
    var addButton = document.querySelector(".GameMoreButton a");
    addButton.addEventListener("click", checkAdded);
    updateMap();
}

function checkAdded() {
    var target = document.querySelector(".GameMoreButton a");
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            observer.disconnect();
            updateMap();
        });
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
}

var listGroup = 0;
function updateMap() {
    var list = document.querySelectorAll(".GameItemList")[listGroup];
    var games = list.querySelectorAll(".GameItemWrap");
    for(var i = 0; i < games.length; i++) {
        var summoners = games[i].querySelectorAll(".SummonerName");
        for(var j = 0; j < summoners.length; j++) {
            var str = summoners[j].innerText;
            if(str != user && map[str] != undefined) {
                map[str].push(i);
            } else {
                map[str] = [];
                map[str].push(i);
            }
        }
    }
    console.log(Object.keys(map));
    listGroup++;
}

function loadAllGames() {
    // TODO
}

function addElements() {
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    document.querySelector("head").appendChild(link);

    button.setAttribute("class", "Button SemiRound White");
    button.textContent = "Load All Games";
    button.addEventListener("click", loadAllGames);
    document.querySelector(".Buttons").appendChild(button);

    search.querySelector("script").remove();
    search.querySelector(".Header").removeAttribute("id");
    search.querySelector("input").setAttribute("placeholder", "Search a Summoner");
    listRecent.querySelectorAll("li").forEach(function(el) {
        el.remove();
    })
    listAll.querySelectorAll("li").forEach(function(el) {
        el.remove();
    })
    document.querySelectorAll(".Navigation .Actions .Action").forEach(function(el) {
        el.style.float = "right";
    })
    document.querySelector(".Navigation .Actions").appendChild(search);
    search.querySelector(".Content").style.display = "block";
}

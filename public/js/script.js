import {toggle, playSong } from './player.js';

const access_token = accessToken; 
const headers = { Authorization: `Bearer ${access_token}` };

// By Artist
const artistName = "Måneskin";
const searchType = "track";
const limit = 50;
const endpoint = `https://api.spotify.com/v1/search?q=artist:${artistName}&type=${searchType}&limit=${limit}`;

var data = [];
var index = -1; 
var song = '';

fetch(endpoint, { headers })
  .then((response) => response.json())
  .then((responseData) => {
    const tracks = responseData.tracks.items;
    tracks.forEach((track) => {
        const song = { titel:track.name, artist:track.artists[0].name, uri:track.uri };
        data.push(song);
    });

    index = Math.floor(Math.random() * data.length);
    song = data[index].titel + " - " + data[index].artist;

    // console.log(`Index: ${index}, song: ${song}`);

    document.getElementById('song').innerHTML = song;
  })
  .catch((error) => console.error(error));

//By Playlist
// https://open.spotify.com/playlist/0b93HVJIgG76zgJaYsEnIZ?si=63d01afe3bef4f18
// const playlist_id = '0b93HVJIgG76zgJaYsEnIZ'; // Swedish Schlager
// const limit = 100;
// const endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=${limit}`;

// var data = [];
// var index = -1; 
// var song = '';

// fetch(endpoint, { headers })
//   .then((response) => response.json())
//   .then((responseData) => {
//     const tracks = responseData.items;
//     tracks.forEach((track) => {
//         const song = { titel:track.track.name, artist:track.track.artists[0].name, uri:track.track.uri };
//         data.push(song);
//     });

//     index = Math.floor(Math.random() * data.length);
//     song = data[index].titel + " - " + data[index].artist;

//     document.getElementById('song').innerHTML = song;
//   })
//   .catch((error) => console.error(error));

// -------------------------------------------

var listened = 1;

var time = 0; 

var isPlaying = false; 
var gameOver = false; 

const lightColor = "#eee";
const darkColor = "#666";
const redColor = "red";
const greenColor = "green";
const bgColor = "#111";
const darkerColor = "#222";

const timeWidth = 700; 
const endTime = 16; 
const alternativesLimit = 7; 

var clearButton = document.querySelector('#textfield i:last-child');
var playButton = document.querySelector('#play i');
var skipButton = document.getElementById('skip');
var submitButton = document.getElementById('submit');

var textDiv = document.getElementById('textfield');
var textfield = document.querySelector("#textfield textarea");

var timeObject = document.getElementById('currentTime');

setInterval(run, 10);
setInterval(timerUntilMidnight, 1000);
document.querySelector("#play p:last-child").innerHTML = "0:" + endTime;


function run() {
    if(isPlaying) {
        var maxWidth = 0;

        var k = listened;
        if(listened > 6)
            k = 6;

        for(let i = 2; i <= k + 1; i++) {
            var part = document.querySelector("#time-parts div:nth-child(" + i + ")");
            var width = part.offsetWidth;
            maxWidth += width;
        }

        if(time < endTime * 100 && timeObject.offsetWidth < maxWidth) {
            time += 1; 
            var newWidth = (time / (endTime * 100)) * 100;
            timeObject.style.width = newWidth + "%";
        } else {
            pause();
        }
    }
}
function timerUntilMidnight() {
    if(gameOver) { // The timer on the winning/losing page
        var hours = "00"; 
        var minutes = "00"; 
        var seconds = "00"; 

        var now = new Date();
        
        var i = 23 - now.getHours(); 
        hours = i.toString();
        if(i < 10)
            hours = "0" + i.toString();

        i = 59 - now.getMinutes();
        minutes = i.toString();
        if(i < 10)
            minutes = "0" + i.toString();

        i = 59 - now.getSeconds();
        seconds = i.toString();
        if(i < 10)
            seconds = "0" + i.toString();

        var timer = document.querySelector("#timeDiv p:last-child");
        timer.innerHTML = hours + ":" + minutes + ":" + seconds;
    }
}

function getPosition() {
    fetch('https://api.spotify.com/v1/me/player', {
    headers: {
        'Authorization': `Bearer ${access_token}`
    }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to get current playback state');
        }
        return response.json();
    })
    .then(data => {
        console.log(`Current position in song: ${data.progress_ms} ms`);
    })
    .catch(error => {
        console.error(error);
    });
}

textfield.addEventListener('input', function() {
    clearAlternatives();

    if(textfield.value.length > 0) {
        var parent = document.querySelector("#alternatives div");
        var count = 0; 
        data.forEach(function(song) {
            if((song.titel.toLowerCase().includes(textfield.value.toLowerCase()) 
                || song.artist.toLowerCase().includes(textfield.value.toLowerCase()))
                && count < alternativesLimit) {
                var div = document.createElement("div");
                div.innerHTML = song.titel + " - " + song.artist;
    
                div.addEventListener('mousedown', function() {
                    textfield.value = div.innerHTML;
                    textfield.value = textfield.value.replace('amp;', '');
                    clearAlternatives();
                })

                parent.appendChild(div);

                count += 1;
            }
        });
    }
})

function clearAlternatives() {
    var parent = document.querySelector("#alternatives div");
    while(parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

clearButton.addEventListener('click', clear);

playButton.addEventListener('click', function() {
    if(playButton.classList.contains("fa-play"))
        play();
    else 
        pause()
});

skipButton.addEventListener('click', function() {
    var icon = document.querySelector("#guesses div:nth-child(" + listened + ") i");
    icon.className = "";
    icon.classList.add("fa-regular");
    icon.classList.add("fa-square");
    icon.style.visibility = "visible";

    var p = document.querySelector("#guesses div:nth-child(" + listened + ") p");
    p.innerHTML = "SKIPPAD";
    p.style.visibility = "visible";

    if(listened < 6)
        revealMore();
    else 
        youLost();
});

submitButton.addEventListener('click', function() {
    var song = textfield.value; 
    clearAlternatives();
    submit(song);
});

textfield.addEventListener('focus', function() {
    textDiv.style.borderColor = greenColor;
});
textfield.addEventListener('blur', function() {
    textDiv.style.borderColor = lightColor;
    clearAlternatives();
});

function submit(choice) {
    var songString = JSON.stringify(choice);
    songString = songString.substring(1, songString.length - 1);

    if(songString != song) {
        if(songString != "") {
            var icon = document.querySelector("#guesses div:nth-child(" + listened + ") i");
            icon.className = "";
            icon.classList.add("fa-solid");
            icon.classList.add("fa-xmark");
            icon.style.visibility = "visible";

            var p = document.querySelector("#guesses div:nth-child(" + listened + ") p");
            p.innerHTML = songString;
            p.style.visibility = "visible";

            clear();
            
            if(listened < 6)
                revealMore();
            else   
                youLost();
        }
    }
    else {
        var icon = document.querySelector("#guesses div:nth-child(" + listened + ") i");
        icon.className = "";
        icon.classList.add("fa-solid");
        icon.classList.add("fa-check");
        icon.style.visibility = "visible";

        var p = document.querySelector("#guesses div:nth-child(" + listened + ") p");
        p.innerHTML = songString;
        p.style.visibility = "visible";
        
        clear();
        youWon();
    }
}

function play() {
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
    time = 0; 

    isPlaying = true;
    playSong(data[index].uri); 
    toggle(true);
}
function pause() {
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
    timeObject.style.width = "0";

    isPlaying = false; 
    toggle(false);
}

function revealMore() {
    if(listened < 6) {
        listened += 1;

        var part = document.querySelector("#time-parts div:nth-child(" + (listened + 1) + ")");
        part.style.backgroundColor = darkColor;

        var prePart = document.querySelector("#time-parts div:nth-child(" + listened + ")");
        prePart.style.borderColor = bgColor; 
    }
}

function clear() {
    textfield.value = "";
}

function youWon() {
    document.querySelector("#statsDiv p:first-child").innerHTML = "Grattis! Du vann!";
    showSong();
}
function youLost() {
    document.querySelector("#statsDiv p:first-child").innerHTML = "Bättre lycka nästa gång!";
    showSong();
}

function showSong() {
    listened++;

    gameOver = true; 

    for(let i = 3; i <= 7; i++) {
        var part = document.querySelector("#time-parts div:nth-child(" + i + ")");
        part.style.width = "0%";
    }
    document.querySelector("#time-parts div:nth-child(2)").style.width = "100%";

    textDiv.style.visibility = "hidden";
    textDiv.style.height = "0";

    var buttons = document.getElementById("buttons");

    buttons.style.visibility = "hidden";
    buttons.style.height = "0";

    var guesses = document.getElementById("guesses");
    guesses.style.visibility = "hidden";
    guesses.style.height = "0";
    for(let i = 1; i <= 6; i++) {
        var icon = document.querySelector("#guesses div:nth-child(" + i + ") i");
        icon.style.visibility = "hidden";

        var p = document.querySelector("#guesses div:nth-child(" + i + ") p");
        p.style.visibility = "hidden";
    }

    var reveal = document.getElementById("reveal");
    reveal.style.visibility = "visible";
    reveal.style.height = "auto";

    for(let i = 1; i <= 6; i++) {
        var part = document.querySelector("#stats div:nth-child(" + i + ")");
        var icon = document.querySelector("#guesses div:nth-child(" + i + ") i");
        if(icon.classList.contains("fa-check"))
            part.style.backgroundColor = greenColor;
        else if(icon.classList.contains("fa-xmark"))
            part.style.backgroundColor = redColor;
        else if(icon.classList.contains("fa-square"))
            part.style.backgroundColor = darkColor;
        else 
            part.style.backgroundColor = darkerColor; 
    }
    
    playButton.className = "";
    playButton.classList.add("fa-solid");

    play();

    timerUntilMidnight();
}

export { listened };
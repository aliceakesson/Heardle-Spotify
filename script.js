var listened = 1;

var audio = new Audio("stormvind.mp3");
var song = "Fångad av en stormvind - Carola";
var time = 0; 

function isPlaying() { return !audio.paused; }

const lightColor = "#eee";
const darkColor = "#666";
const redColor = "red";
const greenColor = "green";
const bgColor = "#111";

const timeWidth = 700; 
const endTime = 16; 

var clearButton = document.querySelector('#textfield i:last-child');
var playButton = document.querySelector('#play i');
var skipButton = document.getElementById('skip');
var submitButton = document.getElementById('submit');

var textDiv = document.getElementById('textfield');
var textfield = document.querySelector("#textfield textarea");

var timeObject = document.getElementById('currentTime');

setInterval(run, 10);
document.querySelector("#play p:last-child").innerHTML = "0:" + endTime;

function run() {
    if(isPlaying()) {
        var maxWidth = 0;
        for(let i = 2; i <= listened + 1; i++) {
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

clearButton.addEventListener('click', clear);

playButton.addEventListener('click', function() {
    if(playButton.classList.contains("fa-play"))
        play()
    else 
        pause()
});

skipButton.addEventListener('click', revealMore);

submitButton.addEventListener('click', function() {
    var song = textfield.value; 
    submit(song);
});

textfield.addEventListener('focus', function() {
    textDiv.style.borderColor = greenColor;
});
textfield.addEventListener('blur', function() {
    textDiv.style.borderColor = lightColor;
});

function submit(song) {
    if(song != this.song) {
        if(song != "") {
            clear();
            revealMore();
        }
    }
    else {
        console.log("Du gissade rätt!");
    }
}

function play() {
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
    audio.currentTime = 0; 
    time = 0; 
    audio.play();
}
function pause() {
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
    audio.pause();
    timeObject.style.width = "0";
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
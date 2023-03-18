var listened = 0;

var audio = new Audio("stormvind.mp3");
var time = 0; 

function isPlaying() { return !audio.paused; }

const lightColor = "#eee";
const darkColor = "#666";
const redColor = "red";
const greenColor = "green";

const timeWidth = 700; 
const endTime = 16 * 1000; 

var clearButton = document.querySelector('#textfield i:last-child');
var playButton = document.querySelector('#play i');
var skipButton = document.getElementById('skip');
var submitButton = document.getElementById('submit');

var textDiv = document.getElementById('textfield');
var textfield = document.querySelector("#textfield textarea");

var timeObject = document.getElementById('currentTime');

setInterval(run, 1);
document.querySelector("#play p:last-child").innerHTML = "0:" + (endTime / 1000);

function run() {
    if(isPlaying()) {
        if(time < endTime) {
            time += 1; 
            var newWidth = (time / endTime) * 100;
            timeObject.style.width = newWidth + "%";
        }
    }
}

clearButton.addEventListener('click', function() {
    textfield.value = "";
});

playButton.addEventListener('click', function() {
    if(playButton.classList.contains("fa-play")) {
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
        audio.currentTime = 0; 
        time = 0; 
        audio.play();
    } else {
        playButton.classList.remove("fa-pause");
        playButton.classList.add("fa-play");
        audio.pause();
        timeObject.style.width = "0";
    }
});

skipButton.addEventListener('click', function() {

});

submitButton.addEventListener('click', submit);

textfield.addEventListener('focus', function() {
    textDiv.style.borderColor = greenColor;
});
textfield.addEventListener('blur', function() {
    textDiv.style.borderColor = lightColor;
});

function submit() {

}

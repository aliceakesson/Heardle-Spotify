var listened = 0;
var isPlaying = false; 

const lightColor = "#eee";
const darkColor = "#666";
const redColor = "red";
const greenColor = "green";

var clearButton = document.querySelector('#textfield i:last-child');
var playButton = document.querySelector('#play i');
var skipButton = document.getElementById('skip');
var submitButton = document.getElementById('submit');

var textDiv = document.getElementById('textfield');
var textfield = document.querySelector("#textfield textarea");

clearButton.addEventListener('click', function() {
    textfield.value = "";
});

playButton.addEventListener('click', function() {
    if(playButton.classList.contains("fa-play")) {
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
    } else {
        playButton.classList.remove("fa-pause");
        playButton.classList.add("fa-play");
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

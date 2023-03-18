const data = [
    {
        titel:"Fångad Av En Stormvind",
        artist:"Carola",
        path:"songs/FangadAvEnStormvind.mp3"
    }, 
    {
        titel:"Jag Kommer",
        artist:"Veronica Maggio",
        path:"songs/JagKommer.mp3"
    }, 
    {
        titel:"Välkommen In",
        artist:"Veronica Maggio",
        path:"songs/ValkommenIn.mp3"
    }
]

var listened = 1;

var index = Math.floor(Math.random() * data.length);

var audio = new Audio(data[index].path);
var song = data[index].titel + " - " + data[index].artist;
document.getElementById('song').innerHTML = song;

var time = 0; 

function isPlaying() { return !audio.paused; }
var gameOver = false; 

const lightColor = "#eee";
const darkColor = "#666";
const redColor = "red";
const greenColor = "green";
const bgColor = "#111";
const darkerColor = "#222";

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
setInterval(timerUntilMidnight, 1000);
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

textfield.addEventListener('input', function() {
    var parent = document.querySelector("#alternatives div");
    while(parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }

    if(textfield.value.length > 0) {
        data.forEach(function(song) {
            if(song.titel.toLowerCase().includes(textfield.value.toLowerCase()) 
                || song.artist.toLowerCase().includes(textfield.value.toLowerCase())) {
                var div = document.createElement("div");
                div.innerHTML = song.titel + " - " + song.artist;
    
                div.addEventListener('click', function() {
                    textfield.value = div.innerHTML;
                })

                parent.appendChild(div);
            }
        });
    }
})

clearButton.addEventListener('click', clear);

playButton.addEventListener('click', function() {
    if(playButton.classList.contains("fa-play"))
        play()
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
            var icon = document.querySelector("#guesses div:nth-child(" + listened + ") i");
            icon.className = "";
            icon.classList.add("fa-solid");
            icon.classList.add("fa-xmark");
            icon.style.visibility = "visible";

            var p = document.querySelector("#guesses div:nth-child(" + listened + ") p");
            p.innerHTML = song;
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
        p.innerHTML = song;
        p.style.visibility = "visible";
        
        clear();
        youWon();
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

function youWon() {
    document.querySelector("#statsDiv p:first-child").innerHTML = "Grattis! Du vann!";
    showSong();
}
function youLost() {
    document.querySelector("#statsDiv p:first-child").innerHTML = "Bättre lycka nästa gång!";
    showSong();
}

function showSong() {
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

    time = 0; 
    audio.currentTime = 0; 
    audio.play();

    playButton.className = "";
    playButton.classList.add("fa-solid");
    playButton.classList.add("fa-pause");

    timerUntilMidnight();
}
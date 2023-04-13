
let startupValue = '';
var startupID = '';

var newPage = false; 

var button = document.getElementById('button');
var select = document.getElementById('select');
var textarea = document.querySelector('textarea');

var chosen = false; 

button.addEventListener("click", function() {
    if(!newPage) {
        startupValue = parseInt(select.value); 
        startupID = textarea.value; 

        if((startupValue > 0 && startupID.length > 0) || startupValue == 6) {
            newPage = true; 

            localStorage.setItem("value", startupValue);
            localStorage.setItem("id", startupID);
            
            window.location.href = "/views/index.html";
        }
    }
});

select.addEventListener("change", function() {
    if(!newPage) {
        if(!chosen) {
            select.style.color = "#ddd";
            chosen = true;
        }

        textarea.value = "";
        textarea.disabled = false; 

        if(select.value == 1) {
            textarea.placeholder = "Enter artist by name";
        } else if(select.value == 2) {
            textarea.placeholder = "Enter artist by id"; 
        } else if(select.value == 3) {
            textarea.placeholder = "Enter the playlist id";
        } else if(select.value == 4) {
            textarea.placeholder = "Enter the album id";
        } else if(select.value == 5) {
            textarea.placeholder = "Enter the track id";
        } else {
            textarea.placeholder = "";
            textarea.disabled = true; 
        }
    }
})

textarea.addEventListener('keydown', function(e) {
    if(e.key == "Enter") {
        e.preventDefault();
        button.click();
    }
})

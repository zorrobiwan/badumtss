const socket = io();

$(document).ready(function () {
    $("#badumtss").click(() => {
        stop();play();
        socket.emit("play");
        
    });

});
socket.on('plays', function (plays) {
    $('#plays').text(plays.plays);
    $('#country').attr("src", "https://purecatamphetamine.github.io/country-flag-icons/3x2/" + plays.country.toUpperCase() + ".svg");
});

function play() {
    var audio = document.getElementById("badumtss-sound");
    audio.play();
}


function stop() {
    var audio = document.getElementById("badumtss-sound");
    audio.pause();
    audio.currentTime = 0;
}


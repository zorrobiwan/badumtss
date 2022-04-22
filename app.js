const express = require('express');
const PORT = process.env.PORT || 3003;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server, {
})
const fs = require('fs');
const { on } = require('events');
var geoip = require('geoip-country');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Morgan
app.use(morgan("dev"));

// server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    getPlays(function (plays) {
        io.emit('plays', plays)
        console.log('Currently ' + plays.plays + ' plays.')
    })
});

// Connection
io.on('connection', (socket) => {
    getPlays(function (plays) {
        console.log('Play from client ' + socket.id + ' at ' + plays.country + '. Total plays: ' + plays.plays);
        io.emit('plays', plays)
    })

    socket.on("play", () => {
        addPlay(socket, function (plays) {
            console.log('Play from client ' + socket.id + ' at ' + plays.country + '. Total plays: ' + plays.plays);
            io.emit('plays', plays)
        })
    })
})

function addPlay(socket, callback) {
    fs.readFile('data/plays.json', (err, data) => {
        if (err) throw err;
        let plays = JSON.parse(data);
        plays.plays = plays.plays + 1;
        var ip = socket.handshake.address;
        //ip = "5.149.142.22";
        if (geoip.lookup(ip) != null) {
            plays.country = country;
            //console.log(plays.plays);
            //console.log(plays.country);
        }
        else{
            plays.country = 'BE';
        }
        fs.writeFile('data/plays.json', JSON.stringify(plays), (err) => {
            if (err) throw err;
            return callback(plays);
        })
    })
}

function getPlays(callback) {
    fs.readFile('data/plays.json', (err, data) => {


        if (err && err.code === 'ENOENT') {
            let plays = {
                plays: 0,
                country: 'Unknown'
            }

            fs.writeFile('data/plays.json', JSON.stringify(plays), (err) => {
                console.log(plays);
                if (err) throw err;
                return callback(plays);
            });
        }
        else {

            let plays = JSON.parse(data);
            return callback(plays);
        }
    })
}

app.set('twig options', {
    allow_async: true,
    strict_variables: false
});

app.get('/', function (req, res) {
    //res.sendFile('index.html', { root: __dirname })
    res.render('badumtss.twig');
})
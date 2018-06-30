var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser')
 
var users = [];

// Setting up an app
var app = express();
var server = app.listen(3000, function(){
    console.log('Listening for requests on port 3000,');
});



// set the view engine to ejs
app.set('view engine', 'ejs');


// Static files
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));


// Login page 
app.get('/', function (req, res) {
    res.render('home', {
        users: users
    });
});

// Home page 
app.get('/home', function (req, res) {
    res.render('home');
});






// Socket setup
var io = socket(server);

io.on('connection', (socket) => {

    console.log('Socket connection', socket.id);

    socket.on('new_user', function (data) {
        console.log('new dude', data);
        users.push(data);
    });

    // Handle chat event
    socket.on('chat', function(data){
        io.sockets.emit('chat', data); // Sends data to each socket, including the one which sent the message
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data); // Sends data to each socket excluding the on which sent the message
        console.log(data);
    });

});
/*
function addNewUser(userName, id) {
    var user = {

        name: userName,
        socketID: id
    };

    users.push(user);

}*/
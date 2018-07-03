// BODY PARSER (APP.USE)- - - - - -JEIGU USERNAME IS NOT DEFINED

var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var users = [];



mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connection");
});

// Setting up an app
var app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// set the view engine to ejs
app.set('view engine', 'ejs');





//use sessions for tracking logins
app.use(session({
    secret: 'reis',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// include routes
var routes = require('./js/router');
app.use('/', routes);

// Static files
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


var server = app.listen(3000, function () {
    console.log('Listening for requests on port 3000,');
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

function addNewUser(userName, id) {
    var user = {

        name: userName,
        socketID: id
    };

    users.push(user);
}
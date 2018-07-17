// BODY PARSER (APP.USE)- - - - - -JEIGU USERNAME IS NOT DEFINED

var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./js/user');
var OnlineUsers = require('./js/online_users');
var Conversations = require('./js/conversation');
var Messages = require('./js/message');




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

    //var sessionid = socket.io.engine.id;
    //console.log(sessionid);
    socket.on('user_online', function (data) {
        console.log('new dude', data);
        var newUser;
        console.log(data);
        User.findOne({ _id: data }) // Retrieving name of a user who have just connected
            .exec(function (err, user) {
                if (err) {
                    //------NEGAUDOMAS ERRORAS

                    console.log(err);

                    //-------------
                } else if (!user) {
                    var err = new Error('User not found.');
                    err.status = 401;
                    //------NEGAUDOMAS ERRORAS

                    console.log(err);

                    //-------------
                } else {
                    newUser = user.username;
                    console.log("ggg" + user.username);
                    console.log(newUser);

                }
                console.log('-----------name');

                console.log(user.username);

                io.sockets.to(socket.id).emit("your_name", user.username);


                console.log(newUser);

                var dbUser = {
                    username: newUser
                };

                OnlineUsers.create(dbUser, function (error) {
                    if (error) {
                        console.log(error);
                    }
                });

                var ObjectId = require('mongodb').ObjectID;

                var myquery = { _id: ObjectId(data) };
                var newvalues = { $set: { socketID: socket.id } };
                User.updateOne(myquery, newvalues, function (err, res) { // Updating users socket.id
                    if (err) throw err;
                    console.log("1 document updated");
                });
                socket.broadcast.emit('update_online_users', newUser); // Signal for each connected user to update list of users who are online

                var listOfOnlineUsers = [];

                OnlineUsers.find({}, function (err, users) {

                    users.forEach(function (user) {
                        listOfOnlineUsers.push(user.username);
                        io.sockets.to(socket.id).emit("update_online_users", user.username);
                    });

                });

            });

    });

    // Handle chat event
    socket.on('chat', function (data) {

        console.log("fff                            " + data.chatName);

        Conversations.findOne({ name: data.chatName }) 
            .exec((err, conversation) => {
                if (err) {
                    //------NEGAUDOMAS ERRORAS

                    console.log(err);

                    //-------------
                }
                else if (!conversation) {
                    var err = new Error('Conversation not found.');
                    err.status = 401;
                    //------NEGAUDOMAS ERRORAS

                    console.log(err);

                    //-------------
                }
                else {

                    console.log('creating a msg');

                    var messageData = { message: data.message, sender: data.sender, conversationName: data.chatName };

                    Messages.create(messageData, function (error, message) {
                        if (error) {
                            console.log(err);
                            return;
                        }
                        console.log(' msg');
                    });

                    for (var i = 0; i < conversation.members.length; i++) {
                        console.log(conversation.members[i]);

                        if (conversation.members[i] != data.sender) {
                            console.log('////////////////////////');
                            console.log("sender              " + data.sender);

                            console.log(conversation.members[i]);

                            User.findOne({ username: conversation.members[i] }) // Retrieving name of a user who have just connected
                                .exec(function (err, user) {
                                    if (err) {
                                        //------NEGAUDOMAS ERRORAS

                                        console.log(err);

                                        //-------------
                                    } else if (!user) {
                                        var err = new Error('User not found.');
                                        err.status = 401;
                                        //------NEGAUDOMAS ERRORAS

                                        console.log(err);

                                        //-------------
                                    } else {
                                        console.log(user.socketID);

                                        io.sockets.to(user.socketID).emit('chat', data); // Sends data to each socket, including the one which sent the message

                                    }

                                });
                                   }
                    }
                }
            });

    });
    // Handle chat event
    socket.on('new_chat', function (data) {
        var found = false;

        var trialName = data.sender + "-" + data.receiver;
        console.log(trialName);
        Conversations.findOne({ name: trialName }).exec((err, conversation) => {
            found = true;
            if (err) {
                console.log(err);
                return;
            }
            if (!conversation) {
                return;
            }
            console.log('im in -------------------');
            console.log(conversation);
            console.log(conversation.name);
            console.log(conversation.members.length);

            io.sockets.to(socket.id).emit("your_chat_name", conversation.name);


            Messages.find({ conversationName: conversation.name }, function (err, message) {
                if (err) {
                    console.log(err);
                }
                message.forEach(function (msg) {

                    var data = { handle: msg.sender, message: msg.message };


                    console.log();

                    io.sockets.to(socket.id).emit("chat", data);
                });

            });
        });

        trialName = data.receiver + "-" + data.sender;
        
        Conversations.findOne({ name: trialName }).exec((err, conversation) =>  {
            found = true;
            if (err) {
                console.log(err);
                return;
            }
            if (!conversation) {
                return;
            }
            console.log('im in -------------------');
            console.log(conversation);
            console.log(conversation.name);
            console.log(conversation.members.length);

            io.sockets.to(socket.id).emit("your_chat_name", conversation.name);


            Messages.find({ conversationName: conversation.name }, function (err, message) {
                if (err) {
                    console.log(err);
                }
                message.forEach(function (msg) {

                    var data = { handle: msg.sender, message: msg.message };


                    console.log();

                    io.sockets.to(socket.id).emit("chat", data);
                });

            });
        });
        

        if (!found) {
            var mb = [];
            mb.push(data.sender);
            mb.push(data.receiver);

            var conversationData = {
                name: data.sender + "-" + data.receiver,
                members: mb
            };

            Conversations.create(conversationData, function (error, user) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('SUCCESS')
                }
            });

        }



        io.sockets.to(socket.id).emit('your_room_name', "");
    });

    // Handle typing event
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data); // Sends data to each socket excluding the on which sent the message
        console.log(data);
    });





});



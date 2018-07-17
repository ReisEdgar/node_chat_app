// Make connection
var socket = io.connect('http://localhost:3000');

var onlineUsers = [];
var rooms
var username;
var companion; // person you are chatting with right now
var currentChatName;
var roomdID;

var sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)sessionID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    document.cookie = 'sessionID' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'; // Deleting a cookie

    socket.emit('user_online', sessionId);


// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    submit = document.getElementById('submit'),
    users = document.getElementById('users'),
    feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function () {
    alert(currentChatName);

    socket.emit('chat', {
        message: message.value,
        sender: username,
        chatName: currentChatName
    });
    message.value = "";
    output.innerHTML += '<p><strong>' + username + ': </strong>' + data.message + '</p>';

});

message.addEventListener('keypress', () => {
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('your_name', function (data) {
    username = data;

    console.log('your name is ' + data);
    handle.value = data;
    onlineUsers.push(username); // If user closes tab and immediatelly logs in again, he still will be in a collection of users who are online and if his name 
                                // won't be pushed into onlineUsers users will see himself among online users
});
// Listen for events
socket.on('chat', function (data) {

    output.innerHTML += '<p><strong>' + data.sender + ': </strong>' + data.message + '</p>';

}); 

// Listen for events
socket.on('your_chat_name', function (data) {


    currentChatName = data;

}); 

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

// Listen for events
socket.on('update_online_users', function (data) {


    for (var i = 0; i < onlineUsers.length; i++) {
        console.log(onlineUsers[i] + onlineUsers.length);
    }

    if (onlineUsers.indexOf(data) == -1) {
        onlineUsers.push(data);
        var link = document.createElement("a");
    //    temp_link.href = "http://test.com";
        link.target = '_blank';
        link.innerHTML = data;


        var par = document.createElement("p");
        par.innerHTML = "";
        par.appendChild(link);

        users.appendChild(par);
        link.addEventListener('click', () => {
           
            var chat_participants = { sender: username, receiver: data };
            companion = data;

            socket.emit('new_chat', chat_participants);
        });
       // link.titel

       // users.innerHTML += '<p><a class = "online_users">' + data + '</a></p>';

    } 
});


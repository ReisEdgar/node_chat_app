var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var MessageSchema = new mongoose.Schema({

    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },

    conversationName: {
        type: String,
        required: true,
    }


});


var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
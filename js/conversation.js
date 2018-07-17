var mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    id: {
        type: String,
        required: false
    },
    members: {
        type: Array,
        required: true,
    }

});

var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
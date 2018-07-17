var mongoose = require('mongoose');

var OnlineUserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,

    }


});


var OnlineUser = mongoose.model('OnlineUser', OnlineUserSchema);
module.exports = OnlineUser;
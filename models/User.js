const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    isCorp: {
        type: Boolean
    },
    skills: [{
        type: string
    }],
    profile_ID_URL: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }

});

var User = mongoose.model('user', UserSchema)

module.exports = User;

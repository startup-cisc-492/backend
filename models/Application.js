const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
    userID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    jobID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'job'
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }

});

var Application = mongoose.model('application', ApplicationSchema)

module.exports = Application;
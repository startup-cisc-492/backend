const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    jobTitle: {
        type: String
    },
    jobDescription: {
        type: String
    },
    userID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    skills: [{
        type: string
    }],
    percentMatch: {
        type: Number
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }

});

var Job = mongoose.model('job', JobSchema)

module.exports = Job;
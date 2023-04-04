const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json())

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.niwwudt.mongodb.net/?retryWrites=true&w=majority`,
        );

        console.log('Connected to MongoDB Database');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

app.post('/signup', async (req, res) => {
    const { name, is_corp, skills, profile_ID_URL, email, password } = req.body;

    if (!name && typeof(name) !== "string" ) { return res.status(400).json({ msg: "Please include name "}) }
    if (!is_corp && typeof(is_corp) !== "boolean" ) { return res.status(400).json({ msg: "Please include is_corp "}) }
    if (!skills) { return res.status(400).json({ msg: "Please include skills "}) }
    if (!email && typeof(email) !== "string" ) { return res.status(400).json({ msg: "Please include email "}) }
    if (!password && typeof(password) !== "string" ) { return res.status(400).json({ msg: "Please include password "}) }

    try {
        let user = await User.findOne({ email })

        if (user) return res.status(400).json({ msg: "User Already exists"})

        user = new User({name, is_corp, skills, profile_ID_URL, email, password});

        await user.save()

        return res.json({
            user: {
                userID: user.id,
                email: email
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }

})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email && typeof(email) !== "string" ) { return res.status(400).json({ msg: "Please include email "}) }
    if (!password && typeof(password) !== "string" ) { return res.status(400).json({ msg: "Please include password "}) }

    try {
        let user = await User.findOne({ email })

        if (!user) return res.status(404).json({ msg: "User not found" })

        if (user.password !== password) {
            return res.status(401).json({ msg: "Incorrect password" })
        }

        let job = await Job.findOne({ userID: user.id })

        let userResponse = {
            userID: user.id,
            email: user.email,
            name: user.name,
            is_corp: user.is_corp,
            skills: user.skills,
            profile_ID_URL: user.profile_ID_URL,
        }

        if (job) userResponse.job = job;

        return res.json({
            userResponse
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
    
})

app.post('/job', async (req, res) => {
    const { jobDescription, userID, jobTitle, skills, percentMatch } = req.body;

    if (!jobDescription && typeof(jobDescription) !== "string" ) { return res.status(400).json({ msg: "Please include jobDescription "}) }
    if (!userID && typeof(userID) !== "string" ) { return res.status(400).json({ msg: "Please include userID "}) }
    if (!jobTitle && typeof(jobTitle) !== "string" ) { return res.status(400).json({ msg: "Please include jobTitle "}) }
    if (!skills) { return res.status(400).json({ msg: "Please include skills "}) }
    if (!percentMatch) { return res.status(400).json({ msg: "Please include percentMatch "}) }
    
    try {
        let user = await User.findOne({ '_id': userID })

        if (!user) return res.status(404).json({ msg: "User does not exist" })

        let job = await Job.findOne({ userID })

        if (job) return res.status(401).json({ msg: "A job already exists from this user" });

        job = new Job({ jobDescription, userID, jobTitle, skills, percentMatch });

        await job.save();

        return res.json({
            jobID: job.id
        })

    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
    
})

app.put('/job', async (req, res) => {
    const { jobDescription, jobID, jobTitle, skills, percentMatch } = req.body;

    try {
        let job = await Job.findOne({ '_id': jobID })

        if (!job) return res.status(404).json({ msg: "Job doesn't exist" })

        if (jobDescription) job.jobDescription = jobDescription;
        if (jobTitle) job.jobTitle = jobTitle;
        if (skills) job.skills = skills;
        if (percentMatch) job.percentMatch = percentMatch;

        await job.save();

        return res.json({
            jobID: job.id
        })

    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
    
})

app.get('/job', async (req, res) => {
    const { userID } = req.body;

    if(!userID) return res.status(400).json({ msg: "Please include userID for query" })

    try {
        let user = await User.findOne({ '_id': userID })

        let jobs = await Job.find({})

        jobs = jobs.filter(job => {
            const matchedSkills = user.skills.filter(skill => job.skills.includes(skill))

            const percentMatch = (matchedSkills.length / job.skills.length) * 100

            if (percentMatch >= job.percentMatch) return true

            return false
        })

        return res.json({ jobs })

    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

app.post('/application', async (req, res) => {
    const { jobID, userID } = req.body;

    if(!userID) return res.status(400).json({ msg: "Please include userID for query" })
    if(!jobID) return res.status(400).json({ msg: "Please include jobID for query" })

    try {
        let application = await Application.findOne({ userID, jobID });

        if (application) return res.status(401).json({ msg: "Application already exists" });

        let user = await User.findOne({ '_id': userID })

        if (!user) return res.status(404).json({ msg: "User not found" });

        let job = await Job.findOne({ '_id': jobID })

        if (!job) return res.status(404).json({ msg: "Job not found" });

        application = new Application({
            userID,
            jobID
        });

        await application.save();

        return res.status(200)
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

app.get('user', async (req, res) => {

    const { userID } = req.body;

    try {
        let user = await User.findOne({ '_id': userID })

        if (!user) return res.status(404).json({ msg: "User not found" })

        return res.json({
            user: {
                name: user.name,
                is_corp: user.is_corp,
                skills: user.skills,
                profile_ID_URL: user.profile_ID_URL,
                email: user.email,
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }

})

app.get('/application', async (req, res) => {
    const { jobID } = req.body;

    if(!jobID) return res.status(400).json({ msg: "Please include jobID for query" })

    try {
        let job = await Job.findOne({ '_id': jobID });

        if (!job) return res.status(404).json({ msg: "Job not found" });

        let applications = await Application.find({ jobID })

        let applicationUserIDs = applications.map(application => mongoose.Types.ObjectId(application.userID))

        let applicationUsers = await User.find({ '_id': 
            { 
                $in: applicationUserIDs
            } 
        })

        let users = applicationUsers.map(user => ({
            name: user.name,
            skills: user.skills,
            profile_ID_URL: user.profile_ID_URL,
            email: user.email
        }));

        return res.json({ users })

    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }

})


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));


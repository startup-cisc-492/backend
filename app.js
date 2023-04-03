const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json())


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

app.post('/signup', (req, res) => {

})

app.post('/signin', (req, res) => {
    
})

app.post('/job', (req, res) => {
    
})

app.get('/job', (req, res) => {
    
})

app.put('/job', (req, res) => {
    
})

app.post('/application', (req, res) => {
    
})


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));


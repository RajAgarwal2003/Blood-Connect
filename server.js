const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bloodconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a schema and model for blood stock requests
const bloodRequestSchema = new mongoose.Schema({
    name: String,
    number: String,
    dob: Date,
    bloodGroup: String,
    gender: String,
    date: { type: Date, default: Date.now },
});

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request from the form
app.post('/search-blood', async (req, res) => {
    try {
        const { name, number, dob, bloodGroup, gender } = req.body;

        // Save the request to MongoDB
        const newRequest = new BloodRequest({ name, number, dob, bloodGroup, gender });
        await newRequest.save();
        res.sendFile(path.join(__dirname, 'index.html'));

        res.status(201).send('Blood request saved successfully!');
    } catch (error) {
        console.error('Error saving blood request:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
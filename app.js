// Import packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const port = 8081;

// Connect db using .env
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(`No connection ${err}`);
    })

// Define Users Schemas
const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true
    }

});
// MVC imports
const userController = require('./controllers/userController');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define Users Model
const collection = new mongoose.model('user', userSchema);

// Load js and css files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

// Route to handle signup form submission
// Signup route
app.post('/signup', userController.signup);

// Route to handle login form submission
// Login route
app.post('/login', userController.login);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

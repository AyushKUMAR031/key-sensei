// Import packages
const express = require('express');
const app = express();
const path = require('path');
// const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const port = 8081;

// Connect db
mongoose.connect("mongodb+srv://akayofficialteam:QJoXs8s4NAdH0nwF@cluster0.osqoliu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(`No connection ${err}`);
    })

// Define Users Schema
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
app.post('/signup', async (req, res) => {
    const data = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        username: req.body.username,
        password: req.body.password,
        age: req.body.age,
        email: req.body.email
    }

    await collection.insertMany([data])

    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ username });

        if (user) {
            if (user.password === password) {
                res.sendFile(path.join(__dirname, 'public/homepage.html'));
            } else {
                res.send("Incorrect password.");
            }
        } else {
            await collection.create({ username, password });
            res.send("User created successfully.");
        }
    } catch (error) {
        console.error("Error:", error);
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

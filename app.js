
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Mongo URL:', process.env.MONGODB_URL ? 'Loaded' : 'Not loaded');

const port = 8081;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(`No connection ${err}`);
    })

const userController = require('./controllers/userController');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const auth = require('./middleware/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'a secret key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}));


app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/welcome.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

app.get('/home', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/profile', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/profile.html'));
});

app.get('/tutorial', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/tutorial.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

// Route to handle signup form submission
// Signup route
app.post('/signup', userController.signup);


app.post('/login', userController.login);

app.get('/api/profile', userController.getProfile);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

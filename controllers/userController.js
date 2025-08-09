const User = require('../models/user');
const path = require('path');

exports.signup = async (req, res) => {
    const { FirstName, LastName, username, password, age, email } = req.body;
    try {
        await User.create({ FirstName, LastName, username, password, age, email });
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } catch (error) {
        res.status(400).send('Signup failed. ' + error.message);
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                res.sendFile(path.join(__dirname, '../public/homepage.html'));
            } else {
                res.send('Incorrect password.');
            }
        } else {
            res.send('User not found.');
        }
    } catch (error) {
        res.status(400).send('Login failed. ' + error.message);
    }
};

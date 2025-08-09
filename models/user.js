const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

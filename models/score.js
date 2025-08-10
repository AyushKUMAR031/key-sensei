const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;

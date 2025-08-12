const User = require('../models/user');
const Score = require('../models/score');
const path = require('path');

exports.signup = async (req, res) => {
    const { FirstName, LastName, username, password, age, email } = req.body;
    try {
        const user = await User.create({ FirstName, LastName, username, password, age, email });
        req.session.userId = user._id;
        res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Signup failed. ' + error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                req.session.userId = user._id;
                res.status(200).json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Incorrect password.' });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'Login failed. ' + error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const scores = await Score.find({ user: user._id }).sort({ timestamp: -1 });

        // Calculate user rank
        const allUsersScores = await Score.aggregate([
            { $group: { _id: "$user", maxWpm: { $max: "$wpm" } } },
            { $sort: { maxWpm: -1 } }
        ]);

        const rank = allUsersScores.findIndex(score => score._id.equals(user._id)) + 1;

        res.status(200).json({ success: true, user, scores, rank: rank > 0 ? rank : "N/A" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profile data. ' + error.message });
    }
};

exports.saveScore = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const { wpm, accuracy } = req.body;
        const score = await Score.create({ user: req.session.userId, wpm, accuracy });
        res.status(201).json({ success: true, message: 'Score saved successfully', score });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving score. ' + error.message });
    }
};

exports.updateProfileIcon = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const { icon } = req.body;
        if (!icon) {
            return res.status(400).json({ success: false, message: 'No icon data provided.' });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.profileIcon = icon;
        await user.save();

        res.status(200).json({ success: true, message: 'Profile icon updated successfully', profileIcon: user.profileIcon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile icon. ' + error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        // Query for the absolute top 3 scores
        const top3Scores = await Score.find({})
            .sort({ wpm: -1 })
            .limit(3)
            .populate('user', 'username');

        // Aggregation query for top 100 unique users by their best score
        const leaderboardScores = await Score.aggregate([
            {
                $group: {
                    _id: "$user",
                    wpm: { $max: "$wpm" },
                    accuracy: { $first: "$accuracy" },
                    timestamp: { $first: "$timestamp" }
                }
            },
            { $sort: { wpm: -1 } },
            { $limit: 100 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            }
        ]);

        res.status(200).json({ 
            success: true, 
            top3Scores, 
            leaderboardScores, 
            currentUserId: req.session.userId 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching leaderboard data. ' + error.message });
    }
};

exports.getNavInfo = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const allUsersScores = await Score.aggregate([
            { $group: { _id: "$user", maxWpm: { $max: "$wpm" } } },
            { $sort: { maxWpm: -1 } }
        ]);

        const rank = allUsersScores.findIndex(score => score._id.equals(user._id)) + 1;

        res.status(200).json({ 
            success: true, 
            username: user.username,
            rank: rank > 0 ? (rank > 1000 ? '1000+' : rank) : "N/A"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching nav info. ' + error.message });
    }
};

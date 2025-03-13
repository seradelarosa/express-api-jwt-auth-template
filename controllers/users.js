const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-token');

const User = require('../models/user');

router.get('/', verifyToken, async (req, res) => {
    try {
        // Get a list of all users, but only return their username and _id
        const users = await User.find({}, "username");

        res.json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        console.log(req);
        // console.log(req);
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: 'keep out! unauthorized.' });
        };
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ err: 'user not found.' });
        };
        res.json({ user });
    } catch (error) {
        res.status(500).json({ err: error.message });
    };
});

module.exports = router;
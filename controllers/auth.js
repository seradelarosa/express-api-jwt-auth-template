// /controllers/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
    });
    // only include username and _id in the payload
    const payload = { username: user.username, _id: user._id };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// sign in route
router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // if user doesn't exist, 401
    if (!user) {
      return res.status(401).json({ err: 'invalid credentials' });
    };
    // check password against hashed database password
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'invalid credentials' });
    };
    // same payload and token as sign-up (same for 1st or 100th time)
    const payload = { username: user.username, _id: user._id };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ err: error.message });
  };
});

module.exports = router;

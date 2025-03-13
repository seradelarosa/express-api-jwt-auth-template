// controllers/test-jwt.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/sign-token', (req, res) => {
  // dummy data for user
  const user = {
    _id: 1,
    username: 'test',
    password: 'test',
  };
  // make a JWT token with sign()
  const token = jwt.sign({ user }, process.env.JWT_SECRET);
  // send back the token
  res.json({ token });
});

router.post('/verify-token', (req, res) => {
  try {
    // remove 'Bearer ' from the auth header
    const token = req.headers.authorization.split(' ')[1];
    // decode JWT token with verify() - returns the data we passed into sign()
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // res
    res.json({ decodedToken });
  } catch (error) {
    res.status(401).json({ err: 'invalid token.' });
  };
});

module.exports = router;
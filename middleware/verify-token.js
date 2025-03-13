const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // get the token
        const token = req.headers.authorization.split(' ')[1];
        // console.log('token:\n', token);
        // decode token into ?an object?
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded:\n', decoded);
        // console.log('decoded.payload:\n', decoded.payload);

        req.user = decoded.payload;
        // console.log(req.user);
        // pass to next middleware
        next();
    } catch (error) {
        res.status(401).json({ err: 'invalid token.' });
    };
};

module.exports = verifyToken;
// const { errorHandler } = require("./error"); // not there 
const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    console.log("Verify user");
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        console.log(decoded);
        req.userId = decoded.u_id; // Add decoded token payload to the request object
        next();
    });
};
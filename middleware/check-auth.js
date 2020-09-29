// all the logic to validate an incoming request for its token
const jwt = require("jsonwebtoken"); 

const HttpError = require("../models/http-errors");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        // token validation
    var token = req.headers.authorization.split(" ")[1];
    if (!token) {
        throw new Error("Authentication failed!");
    }
    var decodedToken = jwt.verify(token, "verySecretDontShare");
    // adding data to the request 
    req.userData = { userId: decodedToken.userId };
    next();
    } catch (err) {
        var error = new HttpError("Authentication failed!", 401);
        return next(error);
    }
};
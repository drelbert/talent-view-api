var uuid = require("uuid/v4");
var { validationResult } = require("express-validator");

var HttpError = require('../models/http-errors');

var User = require('../models/user');


var getUsers = async function (req, res, next) {
    var users;
    try {
        users = await User.find({}, "-password");  // .find returns an array
    } catch (err) {
        var error = new HttpError("Sorry, something has gone wrong, please try again", 500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});  // .map to turn the returned array into an object
};


var getUserById = function (req, res) {
    var userId = req.params.uid;
    var user = TEMP_USERS.find(u => {
        return u.id == userId;
    });

    if (!user) {
        throw new HttpError("No user with that ID", 404);
    }
     // console.log('GET-ing the users')
    res.json({user: user});
}

var signup = async function (req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(
             new HttpError("Please check your entry and try again.", 422)
        );
    };
    var { name, email, password } = req.body;  // Object destructuring in action

    let existingUser
    try {
    existingUser = await User.findOne({ email: email })
    } catch {
        var error = new HttpError(
            "Signup process not complete, please try again.", 500
        );
        return next(error);
    }

    if (existingUser) {
        var error = new HttpError(
            "User already exists, please check the email and try again", 422
        );
        return next(error);
    }

    var userSignedUp = new User({
        name, 
        email, 
        password,
        projects: []
    })

    try {
        await userSignedUp.save();
    } catch (err) {
        var error = new HttpError(
            "Sign up failed.", 500
        );
        return next(error);
    }

    res.status(201).json({user: userSignedUp.toObject({ getters: true }) });
};


var login = async function (req, res, next) {
    var { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email})
    } catch (err) {
        var error = new HttpError(
            "Sign in failed, please check your credentials and try again.", 500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        var error = new HttpError(
            "Invalid credentials, please try again", 401
        );
        return next(error);
    }

    res.json({message: "Login successful!"}); 
};


// Maybe this is deleted as its too similar to the signup?
var addUser = function (req, res, next) {
    var { name, email, password, projectId } = req.body  // Object destructuring in action
    var addedUser = {
        id: uuid(), 
        name, 
        email,
        password,
        projectId
    };
    TEMP_USERS.push(addedUser);

    res.status(201).json({user: addedUser});
}


var updateUser = function (req, res, next) {
    var { name, projectId } = req.body
    var userId = req.params.uid;

    var updatedUser = { ...TEMP_USERS.find(u => u.id == userId) };
    var userIndex = TEMP_USERS.findIndex(u => u.id == userId);
    updatedUser.name = name;
    updatedUser.projectId = projectId;

    TEMP_USERS[userIndex] = updatedUser;

    res.status(200).json({ user: updatedUser });
};



var deleteUser = function (req, res, next) {
    var userId = req.params.uid;
    TEMP_USERS = TEMP_USERS.filter(u => u.id !== userId);
    res.status(200).json({ message: "User deleted!" });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
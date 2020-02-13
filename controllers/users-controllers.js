const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const TEMP_USERS = [
    {
        id: 'u1',
        name: 'El Diablo DJ Uno',
        email: 'diabloUno@gt.com',
        password: 'testers'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: TEMP_USERS});
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!error.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs, please check and enter again', 422);
    }

    const { name, email, password } = req.body;

    //controlling for no email dups
    const hasUser = TEMP_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('User credentials already exist.', 422);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    TEMP_USERS.push(createdUser);

    res.status(201).json({user: createdUser});
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = TEMP_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Login Failed, please check and try again.', 401);
    }
    res.json({message: 'Logged In'})
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
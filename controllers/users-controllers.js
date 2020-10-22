var { validationResult } = require("express-validator");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var HttpError = require("../models/http-errors");
var User = require("../models/user");

var getUsers = async function (req, res, next) {
  var users;
  try {
    users = await User.find({}, "-password"); // .find returns an array
  } catch (err) {
    var error = new HttpError(
      "Sorry, something has gone wrong, please try again",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) }); // .map to turn the returned array into an object
};

var getUserById = async function (req, res) {
  var userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    let error = new HttpError("Could not complete getting this user", 500);
    return next(error);
  }

  if (!user) {
    var error = new HttpError("No users with that ID", 404);

    return next(error);
  }
  res.json({ user: user.toObject({ getters: true }) });
};

var signup = async function (req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Please check your entry and try again.", 422));
  }
  var { name, email, password } = req.body; // Object destructuring in action

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
    var error = new HttpError(
      "Signup process not complete, please try again.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    var error = new HttpError(
      "User already exists, please check the email and try again",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user at this time.", 500);
    return next(error);
  }

  var userSignedUp = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    projects: [],
  });

  try {
    await userSignedUp.save();
  } catch (err) {
    var error = new HttpError("Sign up failed.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userSignedUp.id, email: userSignedUp.email },
      "superSecretDoNotShare",
      { expiresIn: "1h" }
    );
  } catch (err) {
    var error = new HttpError("Sign up failed.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: userSignedUp.id, email: userSignedUp.email, token: token });
};

var login = async function (req, res, next) {
  var { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    var error = new HttpError(
      "Sign in failed, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "superSecretDoNotShare",
      { expiresIn: "1h" }
    );
  } catch (err) {
    var error = new HttpError("Log in failed.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

var updateUser = function (req, res, next) {
  var { name, projectId } = req.body;
  var userId = req.params.uid;

  var updatedUser = { ...TEMP_USERS.find((u) => u.id == userId) };
  var userIndex = TEMP_USERS.findIndex((u) => u.id == userId);
  updatedUser.name = name;
  updatedUser.projectId = projectId;

  TEMP_USERS[userIndex] = updatedUser;

  res.status(200).json({ user: updatedUser });
};

var deleteUser = function (req, res, next) {
  var userId = req.params.uid;
  TEMP_USERS = TEMP_USERS.filter((u) => u.id !== userId);
  res.status(200).json({ message: "User deleted!" });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

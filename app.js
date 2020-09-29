// App server start: npm start
const fs = require("fs");
const path = require("path");

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var projectsRoutes = require('./routes/projects-routes');
var usersRoutes = require('./routes/users-routes');
var HttpError = require('./models/http-errors');

var app = express();

// Registering the middleware
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    
    next();
});

app.use('/api/projects', projectsRoutes);
app.use('/api/users', usersRoutes);


app.use(function (req, res, next){
    var error = new HttpError("Route not found.", 404);
    throw error;
});

app.use(function (error, req, res, next) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
    });
    }
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An Error Occured."});
});

// First starting the backend server with then() function
// Connecting the backend server with the db with a promise
mongoose
    .connect('mongodb+srv://talentAppAdmin:8sMoLjHjRJczwE0Q@cluster0-p6czb.gcp.mongodb.net/talent-view?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });






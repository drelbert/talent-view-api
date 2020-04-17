// App server start: npm start
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var usersRoutes = require('./routes/users-routes');
var projectsRoutes = require('./routes/projects-routes');
var HttpError = require('./models/http-errors');

var app = express();

// Registering the middleware
app.use(bodyParser.json());

app.use('/api/users', usersRoutes);

app.use('/api/projects', projectsRoutes);

app.use(function (req, res, next){
    var error = new HttpError("Route not found.", 404);
    throw error;
});

app.use( function(error, req, res, next) {
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An Error Occured."});
});

// First starting the backend server with then() function
// Connecting the backend server with the db with a promise
mongoose
    .connect('mongodb+srv://talentAppAdmin:8sMoLjHjRJczwE0Q@cluster0-p6czb.gcp.mongodb.net/dev?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });






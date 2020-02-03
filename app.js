const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpeError = require('./models/http-error');

const app = express();

//Middleware for post 
app.use(bodyParser.json());
//Middleware for get
app.use('/api/places', placesRoutes);

//Middleware for some req that did not get a res
app.use((req, res, next) => {
    const error = new HttpeError('Sorry, route not found.', 404);
    throw error;
});

//Setting up the error handler middleware function 
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An Error Occured.'})
});

app.listen(5000);

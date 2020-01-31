const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes')

const app = express();

app.use('/api/places', placesRoutes);

//Setting up the error handler middleware function 
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An Error Occured.'})
});

app.listen(5000);

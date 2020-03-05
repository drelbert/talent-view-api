// App server start: npm start
const express = require('express');
const bodyParser = require('body-parser');

const devAssetsRoutes = require('./routes/devAssets-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

// Registering the middleware
app.use('/api/devAssets', devAssetsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Route not found.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'Sorry, an unknown error occured.'});
});

app.listen(5000);
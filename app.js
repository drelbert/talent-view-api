// App server start: npm start
const express = require('express');
const bodyParser = require('body-parser');

const devAssetsRoutes = require('./routes/devAssets-routes');

const app = express();

// Registering the middleware
app.use(devAssetsRoutes);

app.listen(5000);
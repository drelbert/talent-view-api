const express = require("express");

const router = express.Router();  // Special tool router with the value of express with the Router() function

router.get('/', (re, res, next) => {
    console.log('GET req in devAssets');
    res.json({message: 'Es Working'});
});

module.exports = router;
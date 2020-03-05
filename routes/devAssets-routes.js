const express = require("express");

const devAssetsControllers = require('../controllers/devAssets-controllers');

const router = express.Router();  // Special tool router with the value of express with the Router() function

router.get('/:devid', devAssetsControllers.getDevAssetById);

router.get('/user/:uid', devAssetsControllers.getDevAssetByUserId);

router.post('/', devAssetsControllers.createDevAsset);

module.exports = router;
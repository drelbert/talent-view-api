const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
// Just a set of middleware functions 

const DUMMY_DEVASSETS = [
    {
        id: 'dev1',
        title: 'Lead 3000',
        description: 'Learn to lead the 3000 way!',
        user: 'userOne'
    }
];


const getDevAssetById = function(req, res, next) {
    const renderDevAsset = req.params.devid;
    const devAsset = DUMMY_DEVASSETS.find(d => {
        return d.id == renderDevAsset;
    });

    if (!devAsset) {
       throw new HttpError('Not found.', 404);
    }

    console.log('GET req in devAssets');
    res.json({devAsset});
}

const getDevAssetByUserId = function (req, res, next) {
    const userId = req.params.uid;
    const devAsset = DUMMY_DEVASSETS.find(d => {
        return d.user == userId;
    });

    if (!devAsset) {
        throw new HttpError('Not found.', 404);
     }
     
    res.json({devAsset})
}

const createDevAsset = function (req, res, next) {
    const { title, description, user } = req.body;
    const createdDevAsset = {
        id: uuid(),
        title,
        description,
        user
    };
    DUMMY_DEVASSETS.push(createdDevAsset);

    res.status(200).json(createdDevAsset);
};

exports.getDevAssetById = getDevAssetById;
exports.getDevAssetByUserId = getDevAssetByUserId;
exports.createDevAsset = createDevAsset;
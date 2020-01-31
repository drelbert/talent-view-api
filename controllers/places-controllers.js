//File only delaing with the middleware functions

const HttpError = require('../models/http-error');

const TEMP_PLACES = [
    {
        id: 'p1',
        description: 'Spot on for your next mocha.',
        location: {
            lat: 48.8554879,
            lng: 2.3560339
        },
        address: '17 Rue du Pont Louis-Philippe, 75004 Paris, France',
        creator: 'u977D'
    }
];

//Function expression with fat arrow
    //Alternative syntax 
        //function getPlaceById() { ... }
        //const getPlaceById = function() { ... }
const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    const place = TEMP_PLACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        throw new HttpError('No Place ID Found.');
    }

    res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const place = TEMP_PLACES.find(p => {
        return p.creator === userId;
    });

    if (!place) {
        return next(
            new HttpError('No User ID Found.', 404)
            ); 
    }

    res.json({ place });
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
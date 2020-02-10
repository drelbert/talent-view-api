//File only dealing with the middleware functions

const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const TEMP_PLACES = [
    {
        id: 'p1',
        title: 'Peleton',
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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const place = TEMP_PLACES.filter(p => {
        return p.creator === userId;
    });

    if (!places || places.length === 0) {
        return next(
            new HttpError('No User ID Found.', 404)
            ); 
    }

    res.json({ places });
};

const createPlace = (req, res, next) => {
    //Object destructuring
    const { title, description, location, address, creator } = req.body;
    //New place
    const createdPlace = {
        id: uuid(),
        title, 
        description,
        location,
        address,
        creator
    };

    TEMP_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
};

const updatedPlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...TEMP_PLACES.find(p => p.id === placeId)};
    const placeIndex = TEMP_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    TEMP_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    TEMP_PLACES = TEMP_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({ message: 'Place Deleted.' })
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatedPlace = updatedPlace;
exports.deletePlace = deletePlace;
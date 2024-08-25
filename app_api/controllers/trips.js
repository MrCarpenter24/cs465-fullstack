const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const User = mongoose.model('users');

// GET: /trips - lists all the trips
// Regaurdless of outcome, response must include HTML status code
// and JSON message to the requesting client.

// Function to retrieve the currently authenticated user
const getUser = async (req, res, callback) => {
    if (req.payload && req.payload.email) {
        console.log("Email in payload:", req.payload.email);
        try {
            const user = await User.findOne({ email: req.payload.email }).exec();
            if (!user) {
                return res.status(404).json({ "message": "User not found" });
            }
            callback(req, res, user.name);
        } catch (err) {
            console.log("Error in getUser: ", err);
            return res.status(500).json(err);
        }
    } else {
        return res.status(404).json({ "message": "User not found" });
    }
};

const tripsList = async(req, res) => {
    const q = await Model
        .find({}) // Return all records
        .exec();

        // Uncomment the following line to show the results of the query
        // on the console
        //console.log(q);

    if(!q)
    { // Database returned no data
        return res
                .status(404)
                .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regaurdless of outcome, response must include HTML status code
// and JSON message to the requesting client.

const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode}) // Return a single record
        .exec();

        // Uncomment the following line to show the results of the query
        // on the console
        //console.log(q);

    if(!q)
    { // Database returned no data
        return res
                .status(404)
                .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    getUser(req, res, (req, res) => {
        Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        }, (err, trip) => {
            if (err) {
                return res.status(400).json(err);
            } else {
                return res.status(201).json(trip);
            }
        });
    });

        // Uncomment the following line to show results of operation
        // on the console
        // console.log(q);)
};

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async(req, res) => {

    // Uncomment for debugging
    // console.log(req.params);
    // console.log(req.body);

    getUser(req, res, (req, res) => {
        Trip.findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
            },
            { new: true },
            (err, trip) => {
                if (err) {
                    return res.status(400).json(err);
                }
                if (!trip) {
                    return res.status(404).send({ message: "Trip not found with code " + req.params.tripCode });
                }
                res.send(trip);
                }
            );
        });

        // Uncomment the following line to show results of operation
        // on the console
        console.log(q);

};

// DELETE: /trips/:tripCode - Deletes a trip by its code
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsDeleteTrip = async (req, res) => {
    getUser(req, res, (req, res) => {
        Trip.findOneAndDelete({ 'code': req.params.tripCode })
            .then(trip => {
                if (!trip) {
                    return res.status(404).send({ message: "Trip not found with code " + req.params.tripCode });
                }
                res.send({ message: "Trip deleted successfully!" });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({ message: "Trip not found with code " + req.params.tripCode });
                }
                return res.status(500).json(err);
            });
    });
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
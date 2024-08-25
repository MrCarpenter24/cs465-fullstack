const express = require('express'); // Express app
const router = express.Router();    // Router logic
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'payload'
});

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// define route for registration endpoint
router
    .route('/register')
    .post(authController.register);

// define route for login endpoint
router
    .route('/login')
    .post(authController.login);

// define route for trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes tripsList
    .post(auth, tripsController.tripsAddTrip); // POST Method Adds a Trip // Requires authentication

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes tripsUpdateTrip - requires parameter
// DELETE Method routes tripsUpdateTrip - requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(auth, tripsController.tripsUpdateTrip)     // Requires authentication
    .delete(auth, tripsController.tripsDeleteTrip); // Requires authentication

module.exports = router;
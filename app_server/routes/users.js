var express = require('express');
var router = express.Router();
const authentication = require('../../app_api/controllers/authentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST to register a new user. */
router.post('/register', authentication.register);

module.exports = router;

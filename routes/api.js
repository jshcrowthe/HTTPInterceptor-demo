var express = require('express');
var faker = require('faker');
var router = express.Router();
var counter = 0;

router.get('/authRequired', function(req, res, next) {
  if (req.headers.authorization === 'Bearer my-super-secret-auth-token') return res.send(faker.helpers.createCard());
  return res.status(401).send({
    message: 'ERROR: Unauthorized'
  });
});

router.get('/reliable', function(req, res, next) {
  res.send(faker.helpers.createCard());
});

router.get('/unreliable', function(req, res, next) {
  counter++;
  if (counter % 6 === 0) return res.send(faker.helpers.createCard());
  setTimeout(function() {
    return res.status(503).send({
      message: 'ERROR: API is unreliable and didn\'t return this time around'
    });
  }, 250);
});

module.exports = router;

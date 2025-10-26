const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// POST /countries/refresh
router.post('/refresh', countryController.refreshCountries);

// GET /countries/image
router.get('/image', countryController.getImage);

// GET /countries/status
router.get('/status', countryController.getStatus);

// GET /countries (must be before /:name)
router.get('/', countryController.getAllCountries);

// GET /countries/:name
router.get('/:name', countryController.getCountryByName);

// DELETE /countries/:name
router.delete('/:name', countryController.deleteCountryByName);

module.exports = router;
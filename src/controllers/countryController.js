const countryService = require('../services/countryService');
const { imageExists, getImagePath } = require('../services/imageService');

// POST /countries/refresh
const refreshCountries = async (req, res) => {
  try {
    const result = await countryService.refreshCountries();
    
    res.json({
      message: 'Countries refreshed successfully',
      processed: result.processed,
      inserted: result.inserted,
      updated: result.updated
    });
  } catch (error) {
    if (error.message.includes('Could not fetch data')) {
      return res.status(503).json({
        error: 'External data source unavailable',
        details: error.message
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// GET /countries
const getAllCountries = async (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      currency: req.query.currency,
      sort: req.query.sort
    };
    
    const countries = await countryService.getAllCountries(filters);
    res.json(countries);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// GET /countries/:name
const getCountryByName = async (req, res) => {
  try {
    const country = await countryService.getCountryByName(req.params.name);
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json(country);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// DELETE /countries/:name
const deleteCountryByName = async (req, res) => {
  try {
    const deleted = await countryService.deleteCountryByName(req.params.name);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// GET /status
const getStatus = async (req, res) => {
  try {
    const status = await countryService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// GET /countries/image
const getImage = async (req, res) => {
  try {
    const exists = await imageExists();
    
    if (!exists) {
      return res.status(404).json({ error: 'Summary image not found' });
    }
    
    const imagePath = getImagePath();
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

module.exports = {
  refreshCountries,
  getAllCountries,
  getCountryByName,
  deleteCountryByName,
  getStatus,
  getImage
};
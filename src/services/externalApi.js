const axios = require('axios');

// Fetch all countries from restcountries API
const fetchCountries = async () => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies',
      { timeout: 30000 } // 30 second timeout
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    throw new Error('Could not fetch data from restcountries API');
  }
};

// Fetch exchange rates from exchange rate API
const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(
      'https://open.er-api.com/v6/latest/USD',
      { timeout: 30000 } // 30 second timeout
    );
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    throw new Error('Could not fetch data from exchange rate API');
  }
};

module.exports = {
  fetchCountries,
  fetchExchangeRates
};
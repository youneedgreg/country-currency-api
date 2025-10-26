const { pool } = require('../models/database');
const { fetchCountries, fetchExchangeRates } = require('./externalApi');
const { generateSummaryImage } = require('./imageService');

// Generate random multiplier between 1000 and 2000
const getRandomMultiplier = () => {
  return Math.random() * (2000 - 1000) + 1000;
};

// Calculate estimated GDP
const calculateEstimatedGDP = (population, exchangeRate) => {
  if (!exchangeRate || exchangeRate === 0) return null;
  const multiplier = getRandomMultiplier();
  return (population * multiplier) / exchangeRate;
};

// Process and store countries
const refreshCountries = async () => {
  let connection;
  
  try {
    // Fetch data from external APIs
    console.log('📡 Fetching countries data...');
    const countries = await fetchCountries();
    
    console.log('📡 Fetching exchange rates...');
    const exchangeRates = await fetchExchangeRates();
    
    console.log(`✅ Fetched ${countries.length} countries and ${Object.keys(exchangeRates).length} exchange rates`);
    
    // Get database connection
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    let processedCount = 0;
    let updatedCount = 0;
    let insertedCount = 0;
    
    // Process each country
    for (const country of countries) {
      try {
        const name = country.name;
        const capital = country.capital || null;
        const region = country.region || null;
        const population = country.population || 0;
        const flag_url = country.flag || null;
        
        // Extract currency code
        let currency_code = null;
        let exchange_rate = null;
        let estimated_gdp = 0;
        
        if (country.currencies && country.currencies.length > 0) {
          // Get first currency code
          currency_code = country.currencies[0].code;
          
          // Find exchange rate for this currency
          if (exchangeRates[currency_code]) {
            exchange_rate = exchangeRates[currency_code];
            estimated_gdp = calculateEstimatedGDP(population, exchange_rate);
          } else {
            // Currency not found in exchange rates
            exchange_rate = null;
            estimated_gdp = null;
          }
        }
        
        // Check if country exists (case-insensitive)
        const [existing] = await connection.query(
          'SELECT id FROM countries WHERE LOWER(name) = LOWER(?)',
          [name]
        );
        
        if (existing.length > 0) {
          // Update existing country
          await connection.query(
            `UPDATE countries 
             SET capital = ?, region = ?, population = ?, 
                 currency_code = ?, exchange_rate = ?, estimated_gdp = ?, 
                 flag_url = ?, last_refreshed_at = NOW()
             WHERE id = ?`,
            [capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, existing[0].id]
          );
          updatedCount++;
        } else {
          // Insert new country
          await connection.query(
            `INSERT INTO countries 
             (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url]
          );
          insertedCount++;
        }
        
        processedCount++;
      } catch (error) {
        console.error(`Error processing country ${country.name}:`, error.message);
        // Continue with next country
      }
    }
    
    // Update global last_refreshed_at in metadata table
    await connection.query(
      `UPDATE metadata SET value = NOW(), updated_at = NOW() WHERE key_name = 'last_refreshed_at'`
    );
    
    await connection.commit();
    
    console.log(`✅ Refresh complete: ${processedCount} processed (${insertedCount} inserted, ${updatedCount} updated)`);
    
    // Generate summary image after successful refresh
    console.log('🎨 Generating summary image...');
    await generateSummaryImage();
    
    return {
      success: true,
      processed: processedCount,
      inserted: insertedCount,
      updated: updatedCount
    };
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('❌ Error refreshing countries:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Get all countries with filters
const getAllCountries = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM countries WHERE 1=1';
    const params = [];
    
    // Apply filters
    if (filters.region) {
      query += ' AND LOWER(region) = LOWER(?)';
      params.push(filters.region);
    }
    
    if (filters.currency) {
      query += ' AND currency_code = ?';
      params.push(filters.currency.toUpperCase());
    }
    
    // Apply sorting
    if (filters.sort === 'gdp_desc') {
      query += ' ORDER BY estimated_gdp DESC';
    } else if (filters.sort === 'gdp_asc') {
      query += ' ORDER BY estimated_gdp ASC';
    } else {
      query += ' ORDER BY name ASC';
    }
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error getting countries:', error.message);
    throw error;
  }
};

// Get country by name
const getCountryByName = async (name) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
      [name]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting country:', error.message);
    throw error;
  }
};

// Delete country by name
const deleteCountryByName = async (name) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM countries WHERE LOWER(name) = LOWER(?)',
      [name]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting country:', error.message);
    throw error;
  }
};

// Get status
const getStatus = async () => {
  try {
    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM countries');
    const [metadataResult] = await pool.query(
      "SELECT value FROM metadata WHERE key_name = 'last_refreshed_at'"
    );
    
    return {
      total_countries: countResult[0].count,
      last_refreshed_at: metadataResult[0]?.value || null
    };
  } catch (error) {
    console.error('Error getting status:', error.message);
    throw error;
  }
};

module.exports = {
  refreshCountries,
  getAllCountries,
  getCountryByName,
  deleteCountryByName,
  getStatus
};
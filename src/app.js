const express = require('express');
const countryRoutes = require('./routes/countryRoutes');

const app = express();

// Middleware
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Country Currency API is running!' });
});

// Routes
app.use('/countries', countryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
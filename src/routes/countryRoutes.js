const express = require('express');
const router = express.Router();

// Placeholder routes - we'll implement these in later steps
router.get('/', (req, res) => {
  res.json({ message: 'Countries endpoint - Coming soon!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    total_countries: 0, 
    last_refreshed_at: null 
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const marketService = require('../services/market.service');

// Load demo data
router.get('/demo', async (req, res) => {
  try {
    // Check if any markets exist
    const existingMarkets = await marketService.getAll();
    if (existingMarkets.length === 0) {
      // Add sample markets
      const sampleMarkets = [
        {
          name: 'Downtown Farmers Market',
          description: 'Weekly farmers market in the city center',
          address: '123 Main St, Edmonton, AB',
          website: 'https://example.com'
        },
        {
          name: 'Artisan Craft Fair',
          description: 'Monthly craft fair featuring local artisans',
          address: '456 Art Ave, Edmonton, AB', 
          website: 'https://example.com'
        }
      ];

      for (const market of sampleMarkets) {
        await marketService.create(market, 1); // Using user_id 1 for demo
      }
    }

    // Redirect to discover page
    res.redirect('/discover');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error loading demo data',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;
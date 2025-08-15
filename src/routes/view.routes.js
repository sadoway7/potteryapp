const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

const authMiddleware = require('../middleware/auth.middleware');
const marketController = require('../controllers/market.controller');

// Dashboard page (Protected)
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const trackedMarketService = require('../services/trackedMarket.service');
    const markets = await trackedMarketService.getAllForUser(req.user.id);
    res.render('dashboard', { title: 'My Dashboard', markets });
  } catch (error) {
    res.status(500).send('Error fetching dashboard data');
  }
});

// Discover markets page
router.get('/discover', async (req, res) => {
  try {
    // We'll call the controller method which in turn calls the service
    // For simplicity in rendering, we can also call the service directly here
    // But let's stick to the controller pattern. We need to mock the req/res for the controller.
    // A simpler way for server-side rendering is to call the service directly. Let's do that.
    const marketService = require('../services/market.service');
    const markets = await marketService.getAll();
    res.render('discover', { title: 'Discover Markets', markets: markets });
  } catch (error) {
    res.status(500).send('Error fetching markets');
  }
});

// Single market page
router.get('/dashboard/market/:trackedMarketId', authMiddleware, async (req, res) => {
  try {
    const { trackedMarketId } = req.params;
    const userId = req.user.id;
    const trackedMarketService = require('../services/trackedMarket.service');
    const market = await trackedMarketService.getTrackedMarketById(userId, trackedMarketId);
    if (!market) {
      return res.status(404).send('Tracked market not found or you do not have permission to view it.');
    }
    res.render('manage-market', { title: `Manage ${market.name}`, market });
  } catch (error) {
    res.status(500).send('Error fetching tracked market details');
  }
});

router.get('/market/:id', async (req, res) => {
  try {
    const marketService = require('../services/market.service');
    const market = await marketService.getById(req.params.id);
    if (!market) {
      return res.status(404).send('Market not found');
    }
    res.render('market', { title: market.name, market });
  } catch (error) {
    res.status(500).send('Error fetching market');
  }
});

module.exports = router;

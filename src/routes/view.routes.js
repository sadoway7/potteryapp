const express = require('express');
const router = express.Router();
const trackedMarketService = require('../services/trackedMarket.service');
const marketService = require('../services/market.service');

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

const verifyToken = require('../middleware/auth.middleware');
const marketController = require('../controllers/market.controller');

// Dashboard page (Protected)
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const markets = await trackedMarketService.getAllForUser(req.user.id);
    res.render('dashboard', { title: 'My Dashboard', markets });
  } catch (error) {
    res.status(500).send('Error fetching dashboard data');
  }
});

// Discover markets page
router.get('/discover', async (req, res) => {
  try {
    const markets = await marketService.getAll();
    res.render('discover', { title: 'Discover Markets', markets: markets });
  } catch (error) {
    res.status(500).send('Error fetching markets');
  }
});

// Single market page
router.get('/dashboard/market/:trackedMarketId', verifyToken, async (req, res) => {
  try {
    const { trackedMarketId } = req.params;
    const userId = req.user.id;
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
    const market = await marketService.getById(req.params.id);
    if (!market) {
      return res.status(404).send('Market not found');
    }
    res.render('market', { title: market.name, market });
  } catch (error) {
    res.status(500).send('Error fetching market');
  }
});

// Create new market page (Protected)
router.get('/markets/new', verifyToken, (req, res) => {
  res.render('market-form', { title: 'Create New Market', market: null, editing: false });
});

module.exports = router;

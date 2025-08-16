const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');
const verifyToken = require('../middleware/auth.middleware'); // To protect routes

// GET /api/markets - Get all public markets (with search/filter)
router.get('/', marketController.getAllMarkets);

// GET /api/markets/:id - Get a single market by ID
router.get('/:id', marketController.getMarketById);

// POST /api/markets - Create a new public market
router.post('/', verifyToken, marketController.createMarket);

// PUT /api/markets/:id - Update an existing market
router.put('/:id', verifyToken, marketController.updateMarket);

// DELETE /api/markets/:id - Delete a market
router.delete('/:id', verifyToken, marketController.deleteMarket);


// --- Message Board Routes ---
const messageController = require('../controllers/message.controller');

// GET /api/markets/:marketId/messages - Get all messages for a market
router.get('/:marketId/messages', messageController.getMessagesForMarket);

// POST /api/markets/:marketId/messages - Post a new message
router.post('/:marketId/messages', verifyToken, messageController.postMessage);

// POST /api/markets/:marketId/attributes/:attributeId/vote - Cast a vote for an attribute
router.post('/:marketId/attributes/:attributeId/vote', verifyToken, marketController.addVote);


// --- Tracked Market Routes ---
const trackedMarketController = require('../controllers/trackedMarket.controller');

// POST /api/markets/:marketId/track - Start tracking a market
router.post('/:marketId/track', verifyToken, trackedMarketController.trackMarket);

// DELETE /api/markets/:marketId/track - Stop tracking a market
router.delete('/:marketId/track', verifyToken, trackedMarketController.untrackMarket);

// GET /api/markets/tracked - Get all markets tracked by the current user
router.get('/tracked/all', verifyToken, trackedMarketController.getUserTrackedMarkets);

// PUT /api/markets/tracked/:trackedMarketId - Update the status of a tracked market
router.put('/tracked/:trackedMarketId', verifyToken, trackedMarketController.updateTrackedMarketStatus);


// --- Rating Routes ---
const ratingController = require('../controllers/rating.controller');

// POST /api/markets/:marketId/attributes/:attributeId/vote - Vote for an attribute
router.post('/:marketId/attributes/:attributeId/vote', verifyToken, ratingController.voteOnAttribute);


router.get('/test', (req, res) => {
    res.json({ message: 'Market route test successful!' });
});

module.exports = router;

const trackedMarketService = require('../services/trackedMarket.service');

const trackMarket = async (req, res) => {
    try {
        const { marketId } = req.params;
        const userId = req.user.id;
        const trackedMarket = await trackedMarketService.add(userId, marketId);
        res.status(201).json(trackedMarket);
    } catch (error) {
        res.status(500).json({ message: 'Error tracking market', error: error.message });
    }
};

const untrackMarket = async (req, res) => {
    try {
        const { marketId } = req.params;
        const userId = req.user.id;
        await trackedMarketService.remove(userId, marketId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error untracking market', error: error.message });
    }
};

const getUserTrackedMarkets = async (req, res) => {
    try {
        const userId = req.user.id;
        const markets = await trackedMarketService.getAllForUser(userId);
        res.json(markets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tracked markets', error: error.message });
    }
};

const updateTrackedMarketStatus = async (req, res) => {
    try {
        const { trackedMarketId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const updatedMarket = await trackedMarketService.updateStatus(userId, trackedMarketId, status);
        res.json(updatedMarket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

module.exports = {
  trackMarket,
  untrackMarket,
  getUserTrackedMarkets,
  updateTrackedMarketStatus,
};

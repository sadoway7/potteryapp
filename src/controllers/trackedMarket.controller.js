const trackedMarketService = require('../services/trackedMarket.service');

const trackMarket = async (req, res) => {
    try {
        const { marketId } = req.params;
        const userId = req.user.id;

        if (!Number.isInteger(Number(marketId))) {
            return res.status(400).json({ message: 'Invalid market ID' });
        }

        const trackedMarket = await trackedMarketService.add(userId, marketId);
        res.status(201).json(trackedMarket);
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            return res.status(409).json({ message: 'Market is already being tracked' });
        }
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

        if (!Number.isInteger(Number(trackedMarketId))) {
            return res.status(400).json({ message: 'Invalid tracked market ID' });
        }

        if (!status || typeof status !== 'string') {
            return res.status(400).json({ message: 'Status is required' });
        }

        const updatedMarket = await trackedMarketService.updateStatus(userId, trackedMarketId, status);
        res.json(updatedMarket);
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: 'Tracked market not found' });
        }
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

module.exports = {
  trackMarket,
  untrackMarket,
  getUserTrackedMarkets,
  updateTrackedMarketStatus,
};

const marketService = require('../services/market.service');

const getAllMarkets = async (req, res) => {
  try {
    const markets = await marketService.getAll(req.query);
    
    // For HTML responses, render with filter data
    if (req.accepts('html')) {
      // Get unique cities and zips for filters
      const cities = [...new Set(markets.map(m => m.city).filter(Boolean))];
      const zips = [...new Set(markets.map(m => m.zip).filter(Boolean))];
      
      res.render('discover', {
        markets,
        searchTerm: req.query.search || '',
        selectedCity: req.query.city || '',
        selectedZip: req.query.zip || '',
        cities,
        zips
      });
    } else {
      // For API responses, return JSON
      res.json(markets);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching markets', error: error.message });
  }
};

const getMarketById = async (req, res) => {
  try {
    const market = await marketService.getById(req.params.id);
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market', error: error.message });
  }
};

const createMarket = async (req, res) => {
  try {
    const market = await marketService.create(req.body, req.user.id);
    res.status(201).json(market);
  } catch (error) {
    res.status(500).json({ message: 'Error creating market', error: error.message });
  }
};

const updateMarket = async (req, res) => {
  try {
    const market = await marketService.update(req.params.id, req.body);
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: 'Error updating market', error: error.message });
  }
};

const deleteMarket = async (req, res) => {
  try {
    await marketService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting market', error: error.message });
  }
};

const addVote = async (req, res) => {
  try {
    const { marketId, attributeId } = req.params;
    const userId = req.user.id;
    await marketService.addVoteForAttribute(userId, marketId, attributeId);
    res.status(201).json({ message: 'Vote cast successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error casting vote', error: error.message });
  }
};

module.exports = {
  getAllMarkets,
  getMarketById,
  createMarket,
  updateMarket,
  deleteMarket,
  addVote,
};

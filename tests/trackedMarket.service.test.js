const trackedMarketService = require('../src/services/trackedMarket.service');
const db = require('../src/db/connection');

// The db connection is globally mocked in tests/setup.js

describe('Tracked Market Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllForUser', () => {
    it('should return a list of markets tracked by a user', async () => {
      const userId = 1;
      const mockTrackedMarkets = [
        { tracked_market_id: 1, status: 'Approved', market_id: 10, name: 'City Market' },
        { tracked_market_id: 2, status: 'Interested', market_id: 20, name: 'Art Fair' },
      ];
      db.query.mockResolvedValue({ rows: mockTrackedMarkets });

      const result = await trackedMarketService.getAllForUser(userId);

      expect(db.query).toHaveBeenCalled();
      expect(result).toEqual(mockTrackedMarkets);
    });
  });

  describe('add', () => {
    it('should create a new tracked market entry', async () => {
      const userId = 1;
      const marketId = 10;
      const newTrackedMarket = { id: 3, user_id: userId, market_id: marketId, status: 'Interested' };
      db.query.mockResolvedValue({ rows: [newTrackedMarket] });

      const result = await trackedMarketService.add(userId, marketId);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO tracked_markets (user_id, market_id) VALUES ($1, $2) RETURNING *',
        [userId, marketId]
      );
      expect(result).toEqual(newTrackedMarket);
    });
  });

  describe('remove', () => {
    it('should delete a tracked market entry', async () => {
      const userId = 1;
      const marketId = 10;
      db.query.mockResolvedValue();

      await trackedMarketService.remove(userId, marketId);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM tracked_markets WHERE user_id = $1 AND market_id = $2',
        [userId, marketId]
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a tracked market', async () => {
      const userId = 1;
      const trackedMarketId = 1;
      const newStatus = 'Approved';
      const updatedTrackedMarket = { id: trackedMarketId, user_id: userId, market_id: 10, status: newStatus };
      db.query.mockResolvedValue({ rows: [updatedTrackedMarket] });

      const result = await trackedMarketService.updateStatus(userId, trackedMarketId, newStatus);

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tracked_markets SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [newStatus, trackedMarketId, userId]
      );
      expect(result).toEqual(updatedTrackedMarket);
    });
  });

  describe('getTrackedMarketById', () => {
    it('should return a single tracked market with its details', async () => {
      const userId = 1;
      const trackedMarketId = 1;
      const mockResult = { tracked_market_id: 1, status: 'Approved', name: 'City Market' };
      db.query.mockResolvedValue({ rows: [mockResult] });

      const result = await trackedMarketService.getTrackedMarketById(userId, trackedMarketId);

      expect(db.query).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});

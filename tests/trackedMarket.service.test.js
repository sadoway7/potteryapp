const trackedMarketService = require('../src/services/trackedMarket.service');
const db = require('../src/db/connection');

// Mock the database
jest.mock('../src/db/connection');

describe('TrackedMarket Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = 1;
  const marketId = 1;
  const trackedMarketId = 1;
  const mockTrackedMarket = { 
    id: trackedMarketId, 
    user_id: userId, 
    market_id: marketId,
    status: 'Interested'
  };

  describe('add', () => {
    it('should insert new tracked market and return it', async () => {
      db.query.mockResolvedValue({ rows: [mockTrackedMarket] });

      const result = await trackedMarketService.add(userId, marketId);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO tracked_markets (user_id, market_id) VALUES ($1, $2) RETURNING *',
        [userId, marketId]
      );
      expect(result).toEqual(mockTrackedMarket);
    });

    it('should throw error on database failure', async () => {
      db.query.mockRejectedValue(new Error('DB error'));

      await expect(trackedMarketService.add(userId, marketId))
        .rejects.toThrow('DB error');
    });
  });

  describe('remove', () => {
    it('should delete tracked market', async () => {
      db.query.mockResolvedValue({ rowCount: 1 });

      await trackedMarketService.remove(userId, marketId);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM tracked_markets WHERE user_id = $1 AND market_id = $2',
        [userId, marketId]
      );
    });

    it('should throw error on database failure', async () => {
      db.query.mockRejectedValue(new Error('DB error'));

      await expect(trackedMarketService.remove(userId, marketId))
        .rejects.toThrow('DB error');
    });
  });

  describe('getAllForUser', () => {
    it('should return all tracked markets for user', async () => {
      const mockMarkets = [
        { ...mockTrackedMarket, name: 'Market 1', address: '123 Main St' },
        { ...mockTrackedMarket, id: 2, name: 'Market 2', address: '456 Oak St' }
      ];
      db.query.mockResolvedValue({ rows: mockMarkets });

      const result = await trackedMarketService.getAllForUser(userId);

      expect(db.query).toHaveBeenCalledWith(
        `SELECT
           tm.id AS tracked_market_id,
           tm.status,
           m.id AS market_id,
           m.name,
           m.address
         FROM tracked_markets tm
         JOIN markets m ON tm.market_id = m.id
         WHERE tm.user_id = $1`,
        [userId]
      );
      expect(result).toEqual(mockMarkets);
    });
  });

  describe('updateStatus', () => {
    it('should update status and return updated market', async () => {
      const updatedMarket = { ...mockTrackedMarket, status: 'Applied' };
      db.query.mockResolvedValue({ rows: [updatedMarket] });

      const result = await trackedMarketService.updateStatus(
        userId, trackedMarketId, 'Applied'
      );

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tracked_markets SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        ['Applied', trackedMarketId, userId]
      );
      expect(result).toEqual(updatedMarket);
    });
  });

  describe('getTrackedMarketById', () => {
    it('should return tracked market with full details', async () => {
      const fullMarket = {
        ...mockTrackedMarket,
        name: 'Test Market',
        description: 'A test market',
        address: '123 Main St'
      };
      db.query.mockResolvedValue({ rows: [fullMarket] });

      const result = await trackedMarketService.getTrackedMarketById(
        userId, trackedMarketId
      );

      expect(db.query).toHaveBeenCalledWith(
        `SELECT
           tm.id AS tracked_market_id,
           tm.status,
           m.*
         FROM tracked_markets tm
         JOIN markets m ON tm.market_id = m.id
         WHERE tm.id = $1 AND tm.user_id = $2`,
        [trackedMarketId, userId]
      );
      expect(result).toEqual(fullMarket);
    });
  });
});

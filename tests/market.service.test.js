const marketService = require('../src/services/market.service');
const db = require('../src/db/connection');

// The db connection is globally mocked in tests/setup.js

describe('Market Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all markets from the database', async () => {
      const mockMarkets = [
        { id: 1, name: 'Market A' },
        { id: 2, name: 'Market B' },
      ];
      db.query.mockResolvedValue({ rows: mockMarkets });

      const markets = await marketService.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM markets ORDER BY created_at DESC');
      expect(markets).toEqual(mockMarkets);
    });
  });

  describe('getById', () => {
    it('should return a single market with its attributes', async () => {
      const mockMarket = { id: 1, name: 'Market A' };
      const mockAttributes = [{ id: 1, attribute_name: 'Test', vote_count: 0 }];

      // Mock the two separate queries made by the service function
      db.query
        .mockResolvedValueOnce({ rows: [mockMarket] }) // First call for market
        .mockResolvedValueOnce({ rows: mockAttributes }); // Second call for attributes

      const market = await marketService.getById(1);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM markets WHERE id = $1', [1]);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('LEFT JOIN market_attribute_votes'), [1]);
      expect(market.attributes).toEqual(mockAttributes);
      expect(market.name).toEqual(mockMarket.name);
    });

    it('should return undefined if market is not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const market = await marketService.getById(999);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM markets WHERE id = $1', [999]);
      expect(market).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should insert a new market and return it', async () => {
      const marketData = { name: 'New Market', description: 'A brand new market' };
      const userId = 1;
      const newMarket = { id: 3, ...marketData, created_by_user_id: userId };
      db.query.mockResolvedValue({ rows: [newMarket] });

      const result = await marketService.create(marketData, userId);

      expect(db.query).toHaveBeenCalled();
      expect(result).toEqual(newMarket);
    });
  });

  describe('update', () => {
    it('should update an existing market and return it', async () => {
      const marketData = { name: 'Updated Market', description: 'Updated desc' };
      const marketId = 1;
      const updatedMarket = { id: marketId, ...marketData };
      db.query.mockResolvedValue({ rows: [updatedMarket] });

      const result = await marketService.update(marketId, marketData);

      expect(db.query).toHaveBeenCalled();
      expect(result).toEqual(updatedMarket);
    });
  });

  describe('remove', () => {
    it('should delete a market', async () => {
      const marketId = 1;
      db.query.mockResolvedValue({ rowCount: 1 });

      await marketService.remove(marketId);

      expect(db.query).toHaveBeenCalledWith('DELETE FROM markets WHERE id = $1', [marketId]);
    });
  });

  describe('addVoteForAttribute', () => {
    it('should cast a vote for a market attribute', async () => {
      const userId = 1;
      const marketId = 1;
      const attributeId = 1;
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });

      await marketService.addVoteForAttribute(userId, marketId, attributeId);

      expect(db.query).toHaveBeenCalled();
      const firstCall = db.query.mock.calls[0];
      expect(firstCall[0]).toMatch(/on conflict/i);
      expect(firstCall[1]).toEqual([userId, marketId, attributeId]);
    });
  });
});

const trackedMarketController = require('../src/controllers/trackedMarket.controller');
const trackedMarketService = require('../src/services/trackedMarket.service');
const httpMocks = require('node-mocks-http');

// Mock the service
jest.mock('../src/services/trackedMarket.service');

describe('TrackedMarket Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = { id: 1, email: 'test@example.com' };
  const mockMarket = { id: 1, name: 'Test Market' };
  const mockTrackedMarket = { id: 1, user_id: 1, market_id: 1, status: 'Interested' };

  describe('trackMarket', () => {
    it('should call service.add and return 201 with tracked market', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/markets/1/track',
        params: { marketId: '1' },
        user: mockUser
      });
      const res = httpMocks.createResponse();

      trackedMarketService.add.mockResolvedValue(mockTrackedMarket);

      await trackedMarketController.trackMarket(req, res);

      expect(trackedMarketService.add).toHaveBeenCalledWith(mockUser.id, 1);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockTrackedMarket);
    });

    it('should return 500 on service error', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/markets/1/track',
        params: { marketId: '1' },
        user: mockUser
      });
      const res = httpMocks.createResponse();

      trackedMarketService.add.mockRejectedValue(new Error('DB error'));

      await trackedMarketController.trackMarket(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        message: 'Error tracking market',
        error: 'DB error'
      });
    });
  });

  describe('untrackMarket', () => {
    it('should call service.remove and return 204', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/api/markets/1/track',
        params: { marketId: '1' },
        user: mockUser
      });
      const res = httpMocks.createResponse();

      trackedMarketService.remove.mockResolvedValue();

      await trackedMarketController.untrackMarket(req, res);

      expect(trackedMarketService.remove).toHaveBeenCalledWith(mockUser.id, 1);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('getUserTrackedMarkets', () => {
    it('should call service.getAllForUser and return markets', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/markets/tracked/all',
        user: mockUser
      });
      const res = httpMocks.createResponse();

      const mockMarkets = [
        { ...mockTrackedMarket, ...mockMarket }
      ];
      trackedMarketService.getAllForUser.mockResolvedValue(mockMarkets);

      await trackedMarketController.getUserTrackedMarkets(req, res);

      expect(trackedMarketService.getAllForUser).toHaveBeenCalledWith(mockUser.id);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockMarkets);
    });
  });

  describe('updateTrackedMarketStatus', () => {
    it('should call service.updateStatus and return updated market', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/markets/tracked/1',
        params: { trackedMarketId: '1' },
        body: { status: 'Applied' },
        user: mockUser
      });
      const res = httpMocks.createResponse();

      const updatedMarket = { ...mockTrackedMarket, status: 'Applied' };
      trackedMarketService.updateStatus.mockResolvedValue(updatedMarket);

      await trackedMarketController.updateTrackedMarketStatus(req, res);

      expect(trackedMarketService.updateStatus).toHaveBeenCalledWith(
        mockUser.id, 1, 'Applied'
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(updatedMarket);
    });
  });
});
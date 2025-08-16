const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const verifyToken = require('../src/middleware/auth.middleware');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: 'Authentication token required.'
    });
  });

  it('should attach user to request and call next() for valid token', async () => {
    const user = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.cookies = { token };

    await verifyToken(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 for expired token', async () => {
    const expiredToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    req.cookies = { token: expiredToken };

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toContain('Token expired');
  });

  it('should return 401 for invalid token', async () => {
    req.cookies = { token: 'invalid-token' };

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toContain('Malformed token');
  });

  it('should clear cookie for invalid token', async () => {
    req.cookies = { token: 'invalid-token' };

    await verifyToken(req, res, next);

    expect(res._getHeaders()['set-cookie']).toEqual(['token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']);
  });
});
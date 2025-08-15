const authController = require('../src/controllers/auth.controller');
const authService = require('../src/services/auth.service');

// Mock the service
jest.mock('../src/services/auth.service');

// Mock Express request and response objects
const httpMocks = require('node-mocks-http');

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call authService.register and return 201 on success', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = httpMocks.createResponse();
      const user = { id: 1, email: 'test@example.com' };

      authService.register.mockResolvedValue(user);

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: 'User registered successfully.',
        userId: user.id,
      });
    });

    it('should return 400 if email or password is not provided', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/register',
            body: {
              email: 'test@example.com',
              // password missing
            },
          });
          const res = httpMocks.createResponse();

          await authController.register(req, res);

          expect(res.statusCode).toBe(400);
          expect(res._getJSONData()).toEqual({ message: 'Email and password are required.' });
    });
  });

  describe('login', () => {
    it('should call authService.login and return token on success', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
              email: 'test@example.com',
              password: 'password123',
            },
          });
          const res = httpMocks.createResponse();
          const token = { token: 'test-jwt-token' };

          authService.login.mockResolvedValue(token);

          await authController.login(req, res);

          expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
          expect(res.statusCode).toBe(200);
          expect(res._getJSONData()).toEqual({
            message: 'Login successful.',
            token: token.token,
          });
    });

    it('should return 401 on login failure', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
              email: 'test@example.com',
              password: 'wrongpassword',
            },
          });
          const res = httpMocks.createResponse();

          authService.login.mockRejectedValue(new Error('Invalid credentials'));

          await authController.login(req, res);

          expect(res.statusCode).toBe(401);
          expect(res._getJSONData()).toEqual({
            message: 'Invalid credentials.',
            error: 'Invalid credentials'
          });
    });
  });
});

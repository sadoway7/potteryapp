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
    it('should call authService.login, set token cookie with 1h expiration and redirect on success', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
              email: 'test@example.com',
              password: 'password123',
            },
          });
          const res = httpMocks.createResponse();
          const user = { id: 1, email: 'test@example.com' };

          authService.login.mockResolvedValue(user);

          await authController.login(req, res);

          expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
          expect(res.statusCode).toBe(302);
          expect(res._getRedirectUrl()).toBe('/dashboard');
          
          // Check for token cookie with 1h expiration
          const cookies = res._getHeaders()['set-cookie'];
          expect(cookies).toBeDefined();
          expect(cookies.some(cookie =>
            cookie.includes('token=') && cookie.includes('Max-Age=3600')
          )).toBe(true);
    });

    it('should set token cookie with 7d expiration when rememberMe is checked', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
              email: 'test@example.com',
              password: 'password123',
              rememberMe: 'on'
            },
          });
          const res = httpMocks.createResponse();
          const user = { id: 1, email: 'test@example.com' };

          authService.login.mockResolvedValue(user);

          await authController.login(req, res);

          // Check for token cookie with 7d expiration (604800 seconds)
          const cookies = res._getHeaders()['set-cookie'];
          expect(cookies).toBeDefined();
          expect(cookies.some(cookie =>
            cookie.includes('token=') && cookie.includes('Max-Age=604800')
          )).toBe(true);
    });

    it('should return 401 and render login with error on failure', async () => {
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
          expect(res._getRenderView()).toBe('login');
          expect(res._getRenderData()).toEqual({
            error: 'Invalid credentials',
            email: 'test@example.com'
          });
    });
  });
});

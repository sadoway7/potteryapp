const authService = require('../src/services/auth.service');
const db = require('../src/db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the dependencies
jest.mock('../src/db/connection', () => ({
  query: jest.fn(),
}));
jest.mock('bcryptjs'); // Auto-mocked
jest.mock('jsonwebtoken'); // Auto-mocked

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('register', () => {
    it('should hash the password and create a new user', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedpassword';
      const mockUser = { id: 1, email };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await authService.register(email, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if database query fails', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const errorMessage = 'DB error';

      bcrypt.hash.mockResolvedValue('hashedpassword');
      db.query.mockRejectedValue(new Error(errorMessage));

      await expect(authService.register(email, password)).rejects.toThrow(errorMessage);
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const user = { id: 1, email, password_hash: 'hashedpassword' };
    const userWithoutPassword = { id: 1, email };

    it('should return user without password for valid credentials', async () => {
      db.query.mockResolvedValue({ rows: [user] });
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [email]);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password_hash);
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw an error if user is not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error for invalid credentials', async () => {
      db.query.mockResolvedValue({ rows: [user] });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
    });
  });
});

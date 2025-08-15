// This file runs before each test suite.
// We are mocking the database connection globally to prevent tests from
// trying to connect to a real database, which solves module resolution issues in this environment.
jest.mock('../src/db/connection', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  pool: {
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};

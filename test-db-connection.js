const { testDbConnection } = require('./src/db/connection');

(async () => {
  console.log('Testing database connection...');
  const isConnected = await testDbConnection();
  console.log(isConnected ? '✅ Connection successful' : '❌ Connection failed');
  process.exit(isConnected ? 0 : 1);
})();
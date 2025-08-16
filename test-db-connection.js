const { testDbConnection } = require('./src/db/connection');

(async () => {
  console.log('Testing database connection...');
  const success = await testDbConnection();
  console.log(success ? '✅ Connection successful' : '❌ Connection failed');
  process.exit(success ? 0 : 1);
})();
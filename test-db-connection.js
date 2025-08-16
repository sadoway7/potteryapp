const { testDbConnection } = require('./src/db/connection');

(async () => {
  console.log('Testing database connection...');
  
  // Wait a moment for pool initialization
  await new Promise(resolve => setTimeout(resolve, 1000));

  const isConnected = await testDbConnection();
  if (isConnected) {
    console.log('✅ Connection successful');
    process.exit(0);
  } else {
    console.error('❌ Connection failed');
    process.exit(1);
  }
})();
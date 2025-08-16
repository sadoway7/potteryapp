const { testDbConnection, pool } = require('./src/db/connection');

(async () => {
  console.log('Testing database connection...');
  
  // Wait for pool initialization (max 5 seconds)
  const startTime = Date.now();
  while (!pool && Date.now() - startTime < 5000) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (!pool) {
    console.error('❌ Database pool not initialized after 5 seconds');
    process.exit(1);
  }

  const isConnected = await testDbConnection();
  if (isConnected) {
    console.log('✅ Connection successful');
    console.log('Connection stats:', {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount
    });
    process.exit(0);
  } else {
    console.error('❌ Connection failed');
    process.exit(1);
  }
})();
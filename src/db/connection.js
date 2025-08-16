const { Pool } = require('pg');
require('dotenv').config();

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

let pool;
let mockQuery = () => Promise.resolve({ rows: [] });

const createPoolWithRetry = async (config, retries = 0) => {
  try {
    console.log('Creating new pool with config:', {
      ...config,
      password: '*****' // Don't log actual password
    });
    
    // First try connecting to default postgres database
    const testPool = new Pool({
      user: config.user,
      host: config.host,
      database: 'postgres',
      password: config.password,
      port: parseInt(config.port),
      connectionTimeoutMillis: 5000
    });

    try {
      // Check if our database exists
      const dbCheck = await testPool.query(
        `SELECT 1 FROM pg_database WHERE datname = '${config.database}'`
      );
      if (dbCheck.rows.length === 0) {
        throw new Error(`Database ${config.database} does not exist`);
      }
      
      // Check if user has permissions
      const permCheck = await testPool.query(
        `SELECT 1 FROM pg_roles WHERE rolname = '${config.user}'`
      );
      if (permCheck.rows.length === 0) {
        throw new Error(`User ${config.user} does not exist`);
      }
    } finally {
      await testPool.end();
    }

    // Now connect to our actual database
    const pool = new Pool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: parseInt(config.port),
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20,
      ssl: false,
      application_name: 'potteryapp',
      options: '-c search_path=public',
      query_timeout: 10000
    });
    console.log('Pool created, testing connection...');
    
    // Test connection immediately
    const testResult = await pool.query('SELECT NOW()');
    console.log('Test query successful. Database time:', testResult.rows[0].now);
    return pool;
  } catch (err) {
    console.error('Connection error details:', err);
    if (retries < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retries);
      console.log(`Connection failed, retrying in ${delay}ms... (Attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return createPoolWithRetry(config, retries + 1);
    }
    throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts: ${err.message}`);
  }
};

// Initialize the pool
const initializePool = async () => {
  if (process.env.NODE_ENV === 'test' || !process.env.DB_DATABASE || process.platform === 'win32') {
    return {
      query: mockQuery,
      connect: () => ({ release: () => {} }),
      end: () => {}
    };
  }
  return createPoolWithRetry({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
};

// Immediately invoked async function to initialize pool
(async () => {
  try {
    console.log('Initializing database pool with config:', {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
      password: '*****'
    });
    pool = await initializePool();
    if (process.env.NODE_ENV !== 'test' && process.env.DB_DATABASE) {
      console.log('✅ Database pool initialized successfully');
      // Test connection immediately
      const isConnected = await testDbConnection();
      if (!isConnected) {
        throw new Error('Initial connection test failed');
      }
    }
  } catch (err) {
    console.error('❌ Failed to initialize database pool:', err.message);
    console.log('Retrying in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      pool = await initializePool();
      console.log('✅ Database pool initialized after retry');
    } catch (retryErr) {
      console.error('❌ Failed after retry:', retryErr.message);
      process.exit(1);
    }
  }
})();


const testDbConnection = async () => {
  if (!pool) {
    console.log('Database pool not initialized yet');
    return false;
  }

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful. Current server time:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    return false;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  testDbConnection,
  pool,
  getConnectionStats: () => ({
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  })
};

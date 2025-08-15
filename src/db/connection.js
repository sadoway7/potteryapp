const { Pool } = require('pg');
require('dotenv').config();

let pool;
let mockQuery = () => Promise.resolve({ rows: [] });

// In a test or dev environment without a DB, use a mock pool
if (process.env.NODE_ENV === 'test' || !process.env.DB_DATABASE) {
    pool = {
        query: mockQuery,
        connect: () => ({ release: () => {} }),
        end: () => {}
    };
    console.log("Using mock database pool.");
} else {
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}


const testDbConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful.');
  } catch (err) {
    console.error('Database connection failed.', err.stack);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  testDbConnection,
  pool, // Export pool for more complex transactions if needed
};

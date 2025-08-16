const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

const runMigration = async () => {
  console.log('Starting database migration...');
  
  // Wait for pool to initialize
  await new Promise(resolve => {
    const checkPool = () => {
      if (pool) return resolve();
      setTimeout(checkPool, 100);
    };
    checkPool();
  });

  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sql);
    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Error during database migration:', err);
  } finally {
    client.release();
    pool.end();
  }
};

runMigration();

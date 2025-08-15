const fs = require('fs');
const path = require('path');
const { pool } = require('./connection'); // We use the pool to run the query

const runMigration = async () => {
  console.log('Starting database migration...');
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sql);
    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Error during database migration:', err);
  } finally {
    client.release();
    pool.end(); // End the pool so the script exits
  }
};

runMigration();

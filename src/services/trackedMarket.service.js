const db = require('../db/connection');

const add = async (userId, marketId) => {
  const result = await db.query(
    'INSERT INTO tracked_markets (user_id, market_id) VALUES ($1, $2) RETURNING *',
    [userId, marketId]
  );
  return result.rows[0];
};

const remove = async (userId, marketId) => {
  await db.query('DELETE FROM tracked_markets WHERE user_id = $1 AND market_id = $2', [userId, marketId]);
  return { message: 'Market untracked' };
};

const getAllForUser = async (userId) => {
  const result = await db.query(
    `SELECT
       tm.id AS tracked_market_id,
       tm.status,
       m.id AS market_id,
       m.name,
       m.address
     FROM tracked_markets tm
     JOIN markets m ON tm.market_id = m.id
     WHERE tm.user_id = $1`,
    [userId]
  );
  return result.rows;
};

const updateStatus = async (userId, trackedMarketId, status) => {
  const result = await db.query(
    'UPDATE tracked_markets SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [status, trackedMarketId, userId]
  );
  return result.rows[0];
};

const getTrackedMarketById = async (userId, trackedMarketId) => {
  const result = await db.query(
    `SELECT
       tm.id AS tracked_market_id,
       tm.status,
       m.*
     FROM tracked_markets tm
     JOIN markets m ON tm.market_id = m.id
     WHERE tm.id = $1 AND tm.user_id = $2`,
    [trackedMarketId, userId]
  );
  return result.rows[0];
}

module.exports = {
  add,
  remove,
  getAllForUser,
  updateStatus,
  getTrackedMarketById,
};

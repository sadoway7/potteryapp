const db = require('../db/connection');

const addVote = async (userId, marketId, attributeId) => {
  const result = await db.query(
    'INSERT INTO market_attribute_votes (user_id, market_id, attribute_id) VALUES ($1, $2, $3) RETURNING id',
    [userId, marketId, attributeId]
  );
  return result.rows[0];
};

module.exports = {
  addVote,
};

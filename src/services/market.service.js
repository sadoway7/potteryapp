const db = require('../db/connection');

const getAll = async (queryParams) => {
  // Basic query, can be expanded with search/filter later
  const result = await db.query('SELECT * FROM markets ORDER BY created_at DESC');
  return result.rows;
};

const getById = async (id) => {
  const marketResult = await db.query('SELECT * FROM markets WHERE id = $1', [id]);
  if (!marketResult.rows.length) {
    return undefined;
  }
  const market = marketResult.rows[0];

  const attributesResult = await db.query(
    `SELECT
       att.id,
       att.attribute_name,
       COUNT(vote.id) AS vote_count
     FROM market_attributes att
     LEFT JOIN market_attribute_votes vote ON att.id = vote.attribute_id AND vote.market_id = $1
     GROUP BY att.id
     ORDER BY vote_count DESC`,
    [id]
  );

  market.attributes = attributesResult.rows;
  return market;
};

const create = async (marketData, userId) => {
  const { name, description, address, latitude, longitude, contact_email, website } = marketData;
  const result = await db.query(
    `INSERT INTO markets (name, description, address, latitude, longitude, contact_email, website, created_by_user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, description, address, latitude, longitude, contact_email, website, userId]
  );
  return result.rows[0];
};

const update = async (id, marketData) => {
  const { name, description, address, latitude, longitude, contact_email, website } = marketData;
  const result = await db.query(
    `UPDATE markets
     SET name = $1, description = $2, address = $3, latitude = $4, longitude = $5, contact_email = $6, website = $7
     WHERE id = $8
     RETURNING *`,
    [name, description, address, latitude, longitude, contact_email, website, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  await db.query('DELETE FROM markets WHERE id = $1', [id]);
  return { message: 'Market deleted successfully' };
};

const addVoteForAttribute = async (userId, marketId, attributeId) => {
  // Use INSERT ... ON CONFLICT DO NOTHING to prevent duplicate votes
  const result = await db.query(
    `INSERT INTO market_attribute_votes (user_id, market_id, attribute_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, market_id, attribute_id) DO NOTHING
     RETURNING *`,
    [userId, marketId, attributeId]
  );
  return result.rows[0];
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addVoteForAttribute,
};

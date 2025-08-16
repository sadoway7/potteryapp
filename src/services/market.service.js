const db = require('../db/connection');

const getAll = async (queryParams = {}) => {
  console.log('Executing getAll with params:', queryParams);
  let query = 'SELECT * FROM markets';
  const values = [];
  const conditions = [];
  console.log('Initial query:', query);

  // Handle search term
  if (queryParams.search) {
    conditions.push(`(
      LOWER(name) LIKE LOWER($${values.length + 1}) OR
      LOWER(address) LIKE LOWER($${values.length + 1})
    `);
    values.push(`%${queryParams.search}%`);
  }

  // Handle zip code filter
  if (queryParams.zip) {
    conditions.push(`address LIKE $${values.length + 1}`);
    values.push(`%${queryParams.zip}%`);
  }

  // Handle city filter
  if (queryParams.city) {
    conditions.push(`LOWER(address) LIKE LOWER($${values.length + 1})`);
    values.push(`%${queryParams.city}%`);
  }

  // Combine conditions
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  try {
    console.log('Final query:', query, 'Values:', values);
    const result = await db.query(query, values);
    console.log('Query successful, rows returned:', result.rows.length);
    return result.rows;
  } catch (err) {
    console.error('Database query failed:', err);
    throw err;
  }
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
  // Validate required fields
  const { name, description, website } = marketData;
  if (!name || !description || !website) {
    throw new Error('Name, description and website are required');
  }

  // Validate URL format
  try {
    new URL(website);
  } catch (err) {
    throw new Error('Website must be a valid URL');
  }

  // Check for existing market with same name (case-insensitive)
  const existingMarket = await db.query(
    'SELECT id FROM markets WHERE LOWER(name) = LOWER($1)',
    [name]
  );
  if (existingMarket.rows.length > 0) {
    throw new Error('Market name already exists');
  }

  // Validate user exists
  const userResult = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
  if (userResult.rows.length === 0) {
    throw new Error('Invalid user');
  }

  // Create market
  const { address, latitude, longitude, contact_email } = marketData;
  try {
    const result = await db.query(
      `INSERT INTO markets (name, description, address, latitude, longitude, contact_email, website, created_by_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, address, latitude, longitude, contact_email, website, userId]
    );
    return result.rows[0];
  } catch (err) {
    // Handle database errors
    if (err.code === '23505') { // Unique violation
      throw new Error('Market name already exists');
    }
    throw new Error('Failed to create market');
  }
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

// const db = require('../db/connection');

const getForMarket = async (marketId) => {
    console.log(`Getting messages for market ${marketId}`);
    return [
        { id: 1, user_id: 1, content: 'Does anyone know the booth fee?', created_at: new Date().toISOString() },
        { id: 2, user_id: 2, content: 'I believe it is $50.', parent_post_id: 1, created_at: new Date().toISOString() },
    ];
};

const create = async (marketId, userId, content, parentPostId = null) => {
    console.log(`User ${userId} posting to market ${marketId}: "${content}"`);
    return { id: 3, market_id: marketId, user_id: userId, content, parent_post_id: parentPostId };
};

module.exports = {
    getForMarket,
    create,
};

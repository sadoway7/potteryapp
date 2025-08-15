// const db = require('../db/connection');

const add = async (trackedMarketId, eventData) => {
  console.log(`Adding event to tracked market ${trackedMarketId}:`, eventData);
  return { id: 1, tracked_market_id: trackedMarketId, ...eventData };
};

const getAllForTrackedMarket = async (trackedMarketId) => {
  console.log(`Getting all events for tracked market ${trackedMarketId}`);
  return [{ id: 1, tracked_market_id: trackedMarketId, sales_total: 100 }];
};

const update = async (eventId, eventData) => {
  console.log(`Updating event ${eventId} with:`, eventData);
  return { id: eventId, ...eventData };
};

const remove = async (eventId) => {
  console.log(`Deleting event with ID: ${eventId}`);
  return { message: 'Event deleted successfully' };
};

module.exports = {
  add,
  getAllForTrackedMarket,
  update,
  remove,
};

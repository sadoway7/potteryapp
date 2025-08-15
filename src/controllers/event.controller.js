// const eventService = require('../services/event.service');

const addEvent = async (req, res) => {
  res.status(201).json({ message: `Event added to tracked market ${req.params.trackedMarketId}` });
};

const getEventsForTrackedMarket = async (req, res) => {
  res.json({ message: `Getting events for tracked market ${req.params.trackedMarketId}` });
};

const updateEvent = async (req, res) => {
  res.json({ message: `Updating event ${req.params.eventId}` });
};

const deleteEvent = async (req, res) => {
  res.json({ message: `Deleting event ${req.params.eventId}` });
};

module.exports = {
  addEvent,
  getEventsForTrackedMarket,
  updateEvent,
  deleteEvent,
};

const messageService = require('../services/message.service');

const getMessagesForMarket = async (req, res) => {
    try {
        const { marketId } = req.params;
        const messages = await messageService.getForMarket(marketId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

const postMessage = async (req, res) => {
    try {
        const { marketId } = req.params;
        const { content, parentPostId } = req.body;
        const userId = req.user.id;
        const message = await messageService.create(marketId, userId, content, parentPostId);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error posting message', error: error.message });
    }
};

module.exports = {
    getMessagesForMarket,
    postMessage,
};

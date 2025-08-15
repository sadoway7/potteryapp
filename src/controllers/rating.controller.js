const ratingService = require('../services/rating.service');

const voteOnAttribute = async (req, res) => {
  try {
    const { marketId, attributeId } = req.params;
    const userId = req.user.id;
    await ratingService.addVote(userId, marketId, attributeId);
    res.status(201).json({ message: 'Vote recorded successfully.' });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
        return res.status(409).json({ message: 'You have already voted for this attribute on this market.' });
    }
    res.status(500).json({ message: 'Error recording vote.', error: error.message });
  }
};

module.exports = {
  voteOnAttribute,
};

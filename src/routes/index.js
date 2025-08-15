const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');

// All authentication routes will be prefixed with /auth
router.use('/auth', authRoutes);

const marketRoutes = require('./market.routes');

// Other route modules can be added here in the future
router.use('/markets', marketRoutes);

module.exports = router;

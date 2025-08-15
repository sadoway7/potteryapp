const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register - User registration
router.post('/register', authController.register);

// POST /api/auth/login - User login
router.post('/login', authController.login);

// Example route to test
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route test successful!' });
});


module.exports = router;

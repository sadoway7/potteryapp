const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// GET /register - Registration form
router.get('/register', (req, res) => {
  res.render('register', { error: null, email: '' });
});

// GET /login - Login form
router.get('/login', (req, res) => {
  res.render('login', {
    error: null,
    email: '',
    csrfToken: req.csrfToken() // Generate CSRF token for the form
  });
});

// POST /api/auth/register - User registration
router.post('/register', authController.register);

// POST /api/auth/login - User login
router.post('/login', authController.login);
// GET /logout - User logout
router.get('/logout', authController.logout);

// Example route to test
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route test successful!' });
});


module.exports = router;

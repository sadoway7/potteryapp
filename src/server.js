// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');

// Import database connection test
const { testDbConnection } = require('./db/connection');

const app = express();

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Cookie parser middleware
app.use(cookieParser());
// CSRF protection
app.use(csrf({ cookie: true }));
// Security headers
app.use(helmet());

// CSRF token middleware - pass CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

const expressLayouts = require('express-ejs-layouts');

// --- View Engine Setup ---
app.use(expressLayouts);
app.set('layout', './layouts/main'); // default layout
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Static Files ---
app.use(express.static(path.join(__dirname, '../public')));

// --- Routes ---
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

const viewRoutes = require('./routes/view.routes');
// Demo routes
const demoRoutes = require('./routes/demo.routes');
app.use('/', viewRoutes);
app.use('/', demoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler - catch all undefined routes
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: {}
  });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await testDbConnection();
    console.log('✅ Database connection verified');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
});

module.exports = app;

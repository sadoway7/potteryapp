// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

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
app.use('/', demoRoutes);
app.use('/', viewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
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

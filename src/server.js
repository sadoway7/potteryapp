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
app.use('/', viewRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Test the database connection on startup - DISABLED until deployment
  // testDbConnection();
});

module.exports = app;

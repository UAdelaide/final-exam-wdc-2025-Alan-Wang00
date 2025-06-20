const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
// 6
const session = require('express-session');
app.use(session({
  secret: 'dogwalk_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use('/api', walkRoutes); // walkRoutes
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
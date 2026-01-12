const express = require('express');
const cors = require('cors');

const { corsOrigin } = require('./src/config/env');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Middleware
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

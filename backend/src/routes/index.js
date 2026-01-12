const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const animalRoutes = require('./animalRoutes');
const transactionRoutes = require('./transactionRoutes');

// API versioning
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/animals', animalRoutes);
router.use('/transactions', transactionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

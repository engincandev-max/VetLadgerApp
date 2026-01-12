const express = require('express');
const router = express.Router();
const { transactionController } = require('../controllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateTransaction } = require('../middlewares/validator');

// All transaction routes require authentication
router.use(authMiddleware);

// GET routes
router.get('/', transactionController.getTransactionsByCustomerId);
router.get('/animal', transactionController.getTransactionsByAnimalId);
router.get('/stats', transactionController.getStats);
router.get('/recent', transactionController.getRecentTransactions);
router.get('/balance', transactionController.getCustomerBalance);
router.get('/:id', transactionController.getTransactionById);

// POST routes
router.post('/', validateTransaction, transactionController.createTransaction);

// DELETE routes
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
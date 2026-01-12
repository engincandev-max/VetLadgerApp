const express = require('express');
const router = express.Router();
const { customerController } = require('../controllers');
const { authMiddleware, isVet } = require('../middlewares/authMiddleware');
const { validateCustomer } = require('../middlewares/validator');

// All customer routes require authentication
router.use(authMiddleware);

// GET routes
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);

// POST routes (Vet only)
router.post('/', isVet, validateCustomer, customerController.createCustomer);

// PATCH routes
router.patch('/:id', customerController.updateCustomer);

// DELETE routes (Vet only)
router.delete('/:id', isVet, customerController.deleteCustomer);

module.exports = router;
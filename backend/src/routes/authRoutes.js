const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/login-vet', authController.loginVet);
router.post('/login-customer', authController.loginCustomer);
router.post('/check-code', authController.checkInviteCode);
router.post('/complete-registration', authController.completeRegistration);

router.post('/refresh-token', authMiddleware, authController.refreshToken);

module.exports = router;
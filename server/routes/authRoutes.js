const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-otp', authController.requestOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authMiddleware.protect, authController.getMe);
router.post('/refresh-token', authMiddleware.protect, authController.refreshToken);
router.post('/logout', authMiddleware.protect, authController.logout);

module.exports = router;

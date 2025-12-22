const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', paymentController.getAvailableOptions); // user
router.post('/', adminAuth, paymentController.createPaymentOption);
router.put('/:id', adminAuth, paymentController.updatePaymentOption);
router.delete('/:id', adminAuth, paymentController.deletePaymentOption);

module.exports = router;

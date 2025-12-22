const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', adminAuth, transactionController.getAllTransactions); // فقط Admin
router.post('/', transactionController.createTransaction); // المستخدم ينشئ مباشرة
router.put('/:id', adminAuth, transactionController.updateTransactionStatus); // Admin يغير الحالة

module.exports = router;

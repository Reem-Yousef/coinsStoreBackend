const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/', packageController.getAll);
router.post('/calculate', packageController.calculate);

// Admin routes
router.get('/admin/all', adminAuth, packageController.getAllAdmin);
router.post('/', adminAuth, packageController.create);
router.put('/bulk', adminAuth, packageController.bulkUpdate);
router.put('/:id', adminAuth, packageController.update);
router.delete('/:id', adminAuth, packageController.remove);

module.exports = router;
const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', packageController.getAll);
router.get('/admin/all', adminAuth, packageController.getAllAdmin);
router.post('/', adminAuth, packageController.create);
router.put('/bulk', adminAuth, packageController.bulkUpdate);
router.put('/:id', adminAuth, packageController.update);
router.delete('/:id', adminAuth, packageController.remove);

module.exports = router;
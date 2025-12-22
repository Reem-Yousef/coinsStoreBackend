const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', contactController.getAll);
router.get('/admin/all', adminAuth, contactController.getAllAdmin);
router.post('/', adminAuth, contactController.create);
router.put('/:id', adminAuth, contactController.update);
router.delete('/:id', adminAuth, contactController.remove);

module.exports = router;
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const adminAuth = require('../middleware/adminAuth');

router.get('/settings', settingsController.getSettings);
router.put('/settings', adminAuth, settingsController.updateSettings);

module.exports = router;

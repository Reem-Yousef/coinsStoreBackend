const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  vodafoneCashNumber: { type: String, default: '' },
  whatsappNumbers: { type: [String], default: [] },
  instructions: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', SettingsSchema);

const mongoose = require('mongoose');

const PaymentOptionSchema = new mongoose.Schema({
  type: { type: String, enum: ['vodafone', 'instapay'], required: true },
  value: { type: String, required: true }, // رقم أو لينك
  isActive: { type: Boolean, default: true },
  availableFrom: { type: String }, // "HH:MM"
  availableTo: { type: String }    // "HH:MM"
});

module.exports = mongoose.model('PaymentOption', PaymentOptionSchema);

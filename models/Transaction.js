// const mongoose = require('mongoose');

// const TransactionSchema = new mongoose.Schema({
//   userAmount: Number,
//   coins: Number,
//   paymentType: String,
//   paymentValue: String,
//   status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Transaction', TransactionSchema);


const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userAmount: { type: Number, required: true },
  coins: { type: Number, required: true },
  paymentType: { type: String, required: true },
  paymentValue: { type: String, required: true },
  contacts: [
    {
      type: { type: String, enum: ["whatsapp", "telegram"] },
      value: String
    }
  ],
  status: { type: String, enum: ['confirmed', 'rejected'], default: 'confirmed' }, // فوراً confirmed بعد الدفع
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  minCoins: { 
    type: Number, 
    required: true,
    min: 1
  },
  maxCoins: { 
    type: Number, 
    required: true,
    min: 1
  },
  pricePerK: { 
    type: Number, 
    required: true,
    min: 0
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  order: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

PackageSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Package', PackageSchema);
const mongoose = require('mongoose');

const ContactLinkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['whatsapp', 'telegram', 'facebook', 'instagram', 'other']
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: ''
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

ContactLinkSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('ContactLink', ContactLinkSchema);
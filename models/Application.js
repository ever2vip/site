const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  tier: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'reviewed', 'approved', 'rejected'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);

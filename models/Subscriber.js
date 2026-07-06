const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  source: { type: String, default: 'website' },
  status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', SubscriberSchema);

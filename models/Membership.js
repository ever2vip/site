const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  currency: { type: String, default: '$' },
  period: { type: String, default: 'month' },
  features: [{ type: String }],
  isHighlighted: { type: Boolean, default: false },
  badge: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Membership', MembershipSchema);

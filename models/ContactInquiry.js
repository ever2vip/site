const mongoose = require('mongoose');

const ContactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, default: 'VIP Booking Inquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('ContactInquiry', ContactInquirySchema);

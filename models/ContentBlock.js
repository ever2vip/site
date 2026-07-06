const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  page: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, default: '' },
  type: { type: String, enum: ['text', 'textarea', 'html', 'url'], default: 'text' }
}, { timestamps: true });

module.exports = mongoose.model('ContentBlock', ContentBlockSchema);

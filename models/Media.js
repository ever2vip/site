const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  mimeType: { type: String, required: true },
  usage: { type: String, enum: ['hero', 'event', 'gallery', 'newsletter', 'general'], default: 'general' },
  alt: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Media', MediaSchema);

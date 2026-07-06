const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  startsAt: { type: Date, required: true },
  location: { type: String, required: true },
  posterUrl: { type: String, default: '' },
  countdownEnabled: { type: Boolean, default: true },
  status: { type: String, enum: ['upcoming', 'past', 'draft'], default: 'upcoming' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

EventSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.model('Event', EventSchema);

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Media = require('../models/Media');
const Membership = require('../models/Membership');
const Subscriber = require('../models/Subscriber');
const ContentBlock = require('../models/ContentBlock');
const SiteSetting = require('../models/SiteSetting');
const Application = require('../models/Application');
const ContactInquiry = require('../models/ContactInquiry');

exports.loginView = (req, res) => res.render('admin/login', { title: 'Admin Login', layout: false });

exports.login = async (req, res) => {
  const admin = await Admin.findOne({ email: String(req.body.email || '').toLowerCase() });
  if (!admin || !(await admin.comparePassword(req.body.password || ''))) {
    req.session.error = 'Invalid admin credentials.';
    return res.redirect('/admin/login');
  }
  req.session.adminId = admin._id.toString();
  req.session.success = 'Welcome back.';
  res.redirect('/admin/dashboard');
};

exports.logout = (req, res) => req.session.destroy(() => res.redirect('/admin/login'));

exports.dashboard = async (req, res, next) => {
  try {
    const [events, media, subscribers, applications, inquiries] = await Promise.all([
      Event.countDocuments(), Media.countDocuments(), Subscriber.countDocuments(), Application.countDocuments({ status: 'new' }), ContactInquiry.countDocuments({ status: 'new' })
    ]);
    res.render('admin/dashboard', { title: 'Dashboard', stats: { events, media, subscribers, applications, inquiries } });
  } catch (err) { next(err); }
};

exports.events = async (req, res, next) => {
  try {
    const [events, media] = await Promise.all([Event.find().sort({ startsAt: -1 }).lean(), Media.find({ type: 'image' }).sort({ createdAt: -1 }).lean()]);
    res.render('admin/events', { title: 'Event Management', events, media, editEvent: null });
  } catch (err) { next(err); }
};

exports.editEventView = async (req, res, next) => {
  try {
    const [events, media, editEvent] = await Promise.all([
      Event.find().sort({ startsAt: -1 }).lean(), Media.find({ type: 'image' }).sort({ createdAt: -1 }).lean(), Event.findById(req.params.id).lean()
    ]);
    res.render('admin/events', { title: 'Edit Event', events, media, editEvent });
  } catch (err) { next(err); }
};

exports.saveEvent = async (req, res) => {
  const payload = {
    title: req.body.title,
    description: req.body.description,
    startsAt: req.body.startsAt,
    location: req.body.location,
    posterUrl: req.file ? `/uploads/${req.file.filename}` : req.body.posterUrl,
    countdownEnabled: Boolean(req.body.countdownEnabled),
    status: req.body.status,
    isFeatured: Boolean(req.body.isFeatured)
  };
  if (payload.isFeatured) await Event.updateMany({}, { isFeatured: false });
  if (req.params.id) await Event.findByIdAndUpdate(req.params.id, payload, { runValidators: true });
  else await Event.create(payload);
  req.session.success = 'Event saved.';
  res.redirect('/admin/events');
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  req.session.success = 'Event deleted.';
  res.redirect('/admin/events');
};

exports.media = async (req, res, next) => {
  try { res.render('admin/media', { title: 'Media Manager', media: await Media.find().sort({ createdAt: -1 }).lean() }); }
  catch (err) { next(err); }
};

exports.uploadMedia = async (req, res) => {
  if (!req.file) {
    req.session.error = 'Choose a valid media file.';
    return res.redirect('/admin/media');
  }
  await Media.create({
    title: req.body.title || req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    mimeType: req.file.mimetype,
    usage: req.body.usage || 'general',
    alt: req.body.alt || ''
  });
  req.session.success = 'Media uploaded.';
  res.redirect('/admin/media');
};

exports.deleteMedia = async (req, res) => {
  const item = await Media.findById(req.params.id);
  if (item) {
    const localPath = path.join(__dirname, '..', 'public', item.url);
    fs.existsSync(localPath) && fs.unlinkSync(localPath);
    await item.deleteOne();
  }
  req.session.success = 'Media deleted.';
  res.redirect('/admin/media');
};

exports.memberships = async (req, res, next) => {
  try { res.render('admin/memberships', { title: 'Memberships', memberships: await Membership.find().sort({ sortOrder: 1 }).lean() }); }
  catch (err) { next(err); }
};

exports.saveMembership = async (req, res) => {
  const payload = {
    name: req.body.name,
    price: Number(req.body.price),
    currency: req.body.currency || '$',
    period: req.body.period || 'month',
    features: String(req.body.features || '').split('\n').map(v => v.trim()).filter(Boolean),
    isHighlighted: Boolean(req.body.isHighlighted),
    badge: req.body.badge || '',
    sortOrder: Number(req.body.sortOrder || 0)
  };
  if (req.params.id) await Membership.findByIdAndUpdate(req.params.id, payload, { runValidators: true });
  else await Membership.create(payload);
  req.session.success = 'Membership saved.';
  res.redirect('/admin/memberships');
};

exports.deleteMembership = async (req, res) => {
  await Membership.findByIdAndDelete(req.params.id);
  req.session.success = 'Membership deleted.';
  res.redirect('/admin/memberships');
};

exports.content = async (req, res, next) => {
  try {
    const [blocks, settings] = await Promise.all([ContentBlock.find().sort({ page: 1, key: 1 }).lean(), SiteSetting.find().sort({ key: 1 }).lean()]);
    res.render('admin/content', { title: 'Content & Effects', blocks, settings });
  } catch (err) { next(err); }
};

exports.updateContent = async (req, res) => {
  for (const [key, value] of Object.entries(req.body.blocks || {})) {
    await ContentBlock.findOneAndUpdate({ key }, { value }, { new: true });
  }
  for (const [key, value] of Object.entries(req.body.settings || {})) {
    await SiteSetting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
  }
  req.session.success = 'Content and effects updated.';
  res.redirect('/admin/content');
};

exports.subscribers = async (req, res, next) => {
  try { res.render('admin/subscribers', { title: 'Newsletter', subscribers: await Subscriber.find().sort({ createdAt: -1 }).lean() }); }
  catch (err) { next(err); }
};

exports.deleteSubscriber = async (req, res) => {
  await Subscriber.findByIdAndDelete(req.params.id);
  req.session.success = 'Subscriber deleted.';
  res.redirect('/admin/subscribers');
};

exports.exportSubscribers = async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
  const rows = ['email,status,source,createdAt'].concat(subscribers.map(s => `${s.email},${s.status},${s.source},${s.createdAt.toISOString()}`));
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="pleasure-subscribers.csv"');
  res.send(rows.join('\n'));
};

exports.simulateEmail = async (req, res) => {
  const count = await Subscriber.countDocuments({ status: 'active' });
  req.session.success = `Invitation draft simulated for ${count} active subscribers. Connect SMTP/ESP before real sending.`;
  res.redirect('/admin/subscribers');
};

exports.leads = async (req, res, next) => {
  try {
    const [applications, inquiries] = await Promise.all([Application.find().sort({ createdAt: -1 }).lean(), ContactInquiry.find().sort({ createdAt: -1 }).lean()]);
    res.render('admin/leads', { title: 'Applications & Inquiries', applications, inquiries });
  } catch (err) { next(err); }
};

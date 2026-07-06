const Event = require('../models/Event');
const Media = require('../models/Media');
const Membership = require('../models/Membership');
const Subscriber = require('../models/Subscriber');
const Application = require('../models/Application');
const ContactInquiry = require('../models/ContactInquiry');
const { getContentMap, getSettingsMap } = require('../utils/content');

async function baseData() {
  const [content, settings] = await Promise.all([getContentMap(), getSettingsMap()]);
  return { content, settings };
}

exports.home = async (req, res, next) => {
  try {
    const [data, featuredEvent, memberships, gallery] = await Promise.all([
      baseData(),
      Event.findOne({ status: 'upcoming', isFeatured: true }).sort({ startsAt: 1 }).lean(),
      Membership.find().sort({ sortOrder: 1 }).lean(),
      Media.find({ usage: 'gallery', type: 'image' }).sort({ createdAt: -1 }).limit(8).lean()
    ]);
    res.render('pages/home', { title: 'Home', ...data, featuredEvent, memberships, gallery });
  } catch (err) { next(err); }
};

exports.events = async (req, res, next) => {
  try {
    const [data, upcoming, past] = await Promise.all([
      baseData(),
      Event.find({ status: 'upcoming' }).sort({ startsAt: 1 }).lean(),
      Event.find({ status: 'past' }).sort({ startsAt: -1 }).lean()
    ]);
    res.render('pages/events', { title: 'Events', ...data, upcoming, past });
  } catch (err) { next(err); }
};

exports.membership = async (req, res, next) => {
  try {
    const [data, memberships] = await Promise.all([baseData(), Membership.find().sort({ sortOrder: 1 }).lean()]);
    res.render('pages/membership', { title: 'Membership', ...data, memberships });
  } catch (err) { next(err); }
};

exports.gallery = async (req, res, next) => {
  try {
    const [data, media] = await Promise.all([baseData(), Media.find({ usage: 'gallery' }).sort({ createdAt: -1 }).lean()]);
    res.render('pages/gallery', { title: 'Gallery', ...data, media });
  } catch (err) { next(err); }
};

exports.about = async (req, res, next) => {
  try { res.render('pages/about', { title: 'About', ...(await baseData()) }); }
  catch (err) { next(err); }
};

exports.contact = async (req, res, next) => {
  try { res.render('pages/contact', { title: 'Contact', ...(await baseData()) }); }
  catch (err) { next(err); }
};

exports.subscribe = async (req, res) => {
  try {
    await Subscriber.findOneAndUpdate(
      { email: req.body.email },
      { email: req.body.email, source: req.body.source || 'website', status: 'active' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    req.session.success = 'You are now on the exclusive list.';
  } catch (err) {
    req.session.error = 'Subscription could not be completed.';
  }
  res.redirect(req.get('Referrer') || '/');
};

exports.apply = async (req, res) => {
  try {
    await Application.create(req.body);
    req.session.success = 'Your membership application has been received.';
  } catch (err) { req.session.error = 'Application could not be submitted.'; }
  res.redirect('/membership#application');
};

exports.contactSubmit = async (req, res) => {
  try {
    await ContactInquiry.create(req.body);
    req.session.success = 'Your VIP inquiry has been sent.';
  } catch (err) { req.session.error = 'Your message could not be sent.'; }
  res.redirect('/contact');
};

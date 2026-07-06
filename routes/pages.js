const express = require('express');
const { body } = require('express-validator');
const page = require('../controllers/pageController');
const router = express.Router();

router.get('/', page.home);
router.get('/events', page.events);
router.get('/membership', page.membership);
router.get('/gallery', page.gallery);
router.get('/about', page.about);
router.get('/contact', page.contact);
router.post('/subscribe', body('email').isEmail().normalizeEmail(), page.subscribe);
router.post('/membership/apply', page.apply);
router.post('/contact', page.contactSubmit);

module.exports = router;

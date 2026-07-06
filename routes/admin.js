const express = require('express');
const admin = require('../controllers/adminController');
const upload = require('../config/multer');
const { requireAdmin, redirectIfAuthed } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/login', redirectIfAuthed, admin.loginView);
router.post('/login', redirectIfAuthed, admin.login);
router.post('/logout', requireAdmin, admin.logout);
router.get('/dashboard', requireAdmin, admin.dashboard);

router.get('/events', requireAdmin, admin.events);
router.get('/events/:id/edit', requireAdmin, admin.editEventView);
router.post('/events', requireAdmin, upload.single('posterFile'), admin.saveEvent);
router.put('/events/:id', requireAdmin, upload.single('posterFile'), admin.saveEvent);
router.delete('/events/:id', requireAdmin, admin.deleteEvent);

router.get('/media', requireAdmin, admin.media);
router.post('/media', requireAdmin, upload.single('media'), admin.uploadMedia);
router.delete('/media/:id', requireAdmin, admin.deleteMedia);

router.get('/memberships', requireAdmin, admin.memberships);
router.post('/memberships', requireAdmin, admin.saveMembership);
router.put('/memberships/:id', requireAdmin, admin.saveMembership);
router.delete('/memberships/:id', requireAdmin, admin.deleteMembership);

router.get('/content', requireAdmin, admin.content);
router.post('/content', requireAdmin, admin.updateContent);

router.get('/subscribers', requireAdmin, admin.subscribers);
router.get('/subscribers/export', requireAdmin, admin.exportSubscribers);
router.post('/subscribers/simulate-email', requireAdmin, admin.simulateEmail);
router.delete('/subscribers/:id', requireAdmin, admin.deleteSubscriber);

router.get('/leads', requireAdmin, admin.leads);

module.exports = router;

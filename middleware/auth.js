function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) return next();
  req.flashError = 'Please sign in to continue.';
  return res.redirect('/admin/login');
}

function redirectIfAuthed(req, res, next) {
  if (req.session && req.session.adminId) return res.redirect('/admin/dashboard');
  next();
}

module.exports = { requireAdmin, redirectIfAuthed };

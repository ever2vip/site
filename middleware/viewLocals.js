module.exports = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  res.locals.adminAuthed = Boolean(req.session && req.session.adminId);
  res.locals.path = req.path;
  res.locals.success = req.session?.success || null;
  res.locals.error = req.session?.error || null;
  if (req.session) {
    delete req.session.success;
    delete req.session.error;
  }
  next();
};

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) => {
    const safeBase = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeBase}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']);

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new Error('Unsupported media type'));
    cb(null, true);
  }
});

module.exports = upload;

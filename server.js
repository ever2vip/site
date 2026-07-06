require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const helmet = require('helmet');
const morgan = require('morgan');
const csrf = require('csurf');
const mongoose = require('mongoose'); // تم استيراد موديل مونغوس مباشرة هنا
const connectDB = require('./config/db');
const viewLocals = require('./middleware/viewLocals');

const app = express();

// دالة لتشغيل الـ Seed تلقائياً إذا كانت قاعدة البيانات فارغة
async function autoSeed() {
  try {
    // التحقق من وجود ملف الـ seed في المجلد الرئيسي أو مجلد البذور
    const seedDatabase = require('./seed'); 
    if (typeof seedDatabase === 'function') {
      await seedDatabase();
      console.log('Database checked/seeded successfully! 🎉');
    }
  } catch (err) {
    console.log('Auto-seeding skipped or files already present:', err.message);
  }
}

// الاتصال الآمن والمقاوم للانهيار بقاعدة البيانات
connectDB()
  .then(async () => {
    console.log('Connected to MongoDB successfully! 🎉');
    await autoSeed();
  })
  .catch(err => {
    // تم تعديل هذا الجزء لكي لا يغلق السيرفر (حذفنا process.exit) ليخبرنا بالخطأ الحقيقي
    console.error('CRITICAL: Database connection failed:', err.message);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'pleasure.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pleasure-club' 
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use(csrf());
app.use(viewLocals);

app.use('/', require('./routes/pages'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => res.status(404).render('pages/404', { title: 'Not Found', content: {}, settings: {} }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/500', { title: 'Server Error', content: {}, settings: {}, error: err.message });
});

// تعيين المنفذ ليتوافق مع منصة Render تلقائياً
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Pleasure Private Club running on port ${PORT}`));

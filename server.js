require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const helmet = require('helmet');
const morgan = require('morgan');
const csrf = require('csurf');
const connectDB = require('./config/db');
const viewLocals = require('./middleware/viewLocals');

const app = express();

connectDB().catch(err => {
  console.error(err);
  process.exit(1);
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
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Pleasure Private Club running on http://localhost:${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const packagesRoute = require('./routes/packages');
const adminRoute = require('./routes/admin');
const paymentsRoute = require('./routes/payments');
const transactionsRoute = require('./routes/transactions');
const contactsRoute = require('./routes/contacts');
const authRoutes = require('./routes/auth');

const { requireAuth, requireAdmin } = require('./middleware/auth');

const app = express();

// اذا موقعك خلف proxy (مثل Vercel)، فعل السطر التالي حتى rate-limit و secure cookies تشتغل صح
app.set('trust proxy', 1);

// ===== Security middlewares =====
app.use(helmet({
  // محتوى CSP بسيط ومُناسب لتطبيقك، عدّليه اذا عندك third-party scripts إضافية
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      connectSrc: ["'self'", "https://coins-store-backend.vercel.app", "https://3fretstore.com"],
      imgSrc: ["'self'", "data:", "https:"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  }
}));

// Prevent HTTP parameter pollution
app.use(hpp());
// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());
// Prevent XSS attacks in request bodies
app.use(xssClean());

// ===== CORS (سماح فقط للدومينات الموثوقة) =====
const allowedOrigins = [
  "https://3fretstore.com",
  "https://www.3fretstore.com",
  "https://frontend-jet-eight-43.vercel.app" // اذا تستعملي ال-preview domain
];

app.use(cors({
  origin: function (origin, callback) {
    // origin === undefined يعني request من Postman او server-to-server أو same-origin (مسموح)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// ===== Rate limiting =====
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // حد عام لكل IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use(generalLimiter);

// أبقي محددات أقوى للـ auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later." }
});
app.use('/api/auth', authLimiter);

// ===== Parsers =====
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ===== Connect DB =====
connectDB(process.env.MONGODB_URI);

// ===== Routes =====
// راوتات عامة
app.use('/api/packages', packagesRoute);
app.use('/api/payments', paymentsRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/contacts', contactsRoute);
app.use('/api/auth', authRoutes);

// راوتات الادمن: نضمن انها محمية وممنوعة من الindexing
app.use('/api/admin', (req, res, next) => {
  // نضيف هيدر يمنع الظهور لمحركات البحث (حماية إضافية)
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
}, requireAuth, requireAdmin, adminRoute);

// test endpoint
app.get('/', (req, res) => res.send('Backend is running'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  // لو كان خطأ من CORS أو من rate-limit او غيره ممكن يكون err.message
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const cookieParser = require('cookie-parser');

// const packagesRoute = require('./routes/packages');
// const adminRoute = require('./routes/admin');
// const paymentsRoute = require('./routes/payments');
// const transactionsRoute = require('./routes/transactions');
// const contactsRoute = require('./routes/contacts');
// const authRoutes = require('./routes/auth');

// const app = express();

// // middleware
// app.use(cors({
//     origin: [
//       "https://3fretstore.com",
//     "https://www.3fretstore.com"
//     ],
//     credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));

// app.use(cookieParser());

// // connect DB
// connectDB(process.env.MONGODB_URI);

// // routes
// app.use('/api/packages', packagesRoute);
// app.use('/api/admin', adminRoute);
// app.use('/api/payments', paymentsRoute);
// app.use('/api/transactions', transactionsRoute);
// app.use('/api/contacts', contactsRoute);
// app.use('/api/auth', authRoutes);

// // test endpoint
// app.get('/', (req, res) => res.send('Backend is running'));

// // error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Server Error'
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;


// // 'https://frontend-jet-eight-43.vercel.app',

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// security libs
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

const app = express();

// If behind proxy (like Vercel)
app.set('trust proxy', 1);

// ===== CORS (allow only your frontends) =====
const allowedOrigins = [
  "https://3fretstore.com",
  "https://www.3fretstore.com",
  "http://localhost:5173", // dev Vite
  "https://frontend-jet-eight-43.vercel.app" // optional preview
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools (Postman)
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// ===== Security middlewares =====
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(xssClean());

// ===== Rate limiting =====
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use(generalLimiter);

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
// public routes
app.use('/api/packages', packagesRoute);
app.use('/api/payments', paymentsRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/contacts', contactsRoute);
app.use('/api/auth', authRoutes);

// admin routes: add X-Robots-Tag header to prevent indexing, then mount admin router
app.use('/api/admin', (req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
}, adminRoute);

// test endpoint
app.get('/', (req, res) => res.send('Backend is running'));

// error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

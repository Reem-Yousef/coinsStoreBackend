require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const packagesRoute = require('./routes/packages');
const adminRoute = require('./routes/admin');
const paymentsRoute = require('./routes/payments');
const transactionsRoute = require('./routes/transactions');
const contactsRoute = require('./routes/contacts');

const app = express();

// middleware
app.use(cors({
    origin: [
      "https://3fretstore.com",
    "https://www.3fretstore.com"
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// connect DB
connectDB(process.env.MONGODB_URI);

// routes
app.use('/api/packages', packagesRoute);
app.use('/api/admin', adminRoute);
app.use('/api/payments', paymentsRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/contacts', contactsRoute);

// test endpoint
app.get('/', (req, res) => res.send('Backend is running'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;


// 'https://frontend-jet-eight-43.vercel.app',
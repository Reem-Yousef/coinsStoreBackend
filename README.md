# Coins Store Backend 💰

A secure, robust backend API for a coins/currency trading platform built with Node.js and Express.

**Live URL:** https://coins-store-backend.vercel.app

## 📋 Description

Coins Store Backend is a RESTful API server that powers a cryptocurrency/coins trading platform. It provides comprehensive functionality for managing user authentication, packages, payments, transactions, admin operations, and customer contacts.

## ✨ Features

- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Package Management** - Create and manage coin packages for sale
- **Payment Processing** - Integrated payment gateway handling
- **Transaction Tracking** - Complete transaction history and management
- **Admin Dashboard** - Administrative controls and monitoring
- **Contact Management** - Customer inquiry and contact handling
- **Security** - Helmet.js, XSS protection, rate limiting, SQL injection prevention
- **CORS Support** - Configured for secure frontend communication
- **MongoDB Integration** - Scalable NoSQL database with Mongoose ODM
- **Rate Limiting** - Prevents abuse with configurable request limits
- **Error Handling** - Comprehensive error management and logging

## 🛠️ Technology Stack

- **Runtime** - Node.js
- **Framework** - Express.js ^4.22.1
- **Database** - MongoDB with Mongoose ^7.8.8
- **Authentication** - JWT (jsonwebtoken ^9.0.3)
- **Password Hashing** - bcryptjs ^3.0.3
- **Security** - Helmet, Express-rate-limit, XSS-clean, HPP, Express-mongo-sanitize
- **Deployment** - Vercel
- **Development** - Nodemon ^2.0.22

## 📁 Project Structure

```
coinsStoreBackend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/              # Route controllers (business logic)
├── middleware/               # Custom middleware functions
├── models/                   # Mongoose schemas and models
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── packages.js          # Package management routes
│   ├── admin.js             # Admin routes
│   ├── payments.js          # Payment routes
│   ├── transactions.js      # Transaction routes
│   └── contacts.js          # Contact/inquiry routes
├── seed/
│   └── seed.js              # Database seeding script
├── index.js                 # Main application file
├── package.json             # Project dependencies
├── package-lock.json        # Locked dependency versions
├── vercel.json              # Vercel deployment configuration
└── .gitignore              # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB instance (local or Atlas)
- Environment variables configured

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Reem-Yousef/coinsStoreBackend.git
cd coinsStoreBackend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in root directory:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Seed the database (optional):**
```bash
npm run seed
```

### Running the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update` - Update user profile
- `POST /api/auth/reset-password` - Password reset

### Packages (`/api/packages`)
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

### Payments (`/api/payments`)
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/verify` - Verify payment

### Transactions (`/api/transactions`)
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions/export` - Export transactions

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/transactions` - All transactions
- `POST /api/admin/reports` - Generate reports

### Contacts (`/api/contacts`)
- `POST /api/contacts` - Submit contact inquiry
- `GET /api/contacts` - Get all contacts (admin)
- `PUT /api/contacts/:id` - Update contact status

## 🔐 Security Features

### Implemented Security Measures:
- **Helmet.js** - Sets HTTP headers for protection
- **Rate Limiting** - 200 requests per 15 minutes (general), 20 for auth
- **CORS** - Whitelist allowed origins
- **XSS Protection** - XSS-clean middleware
- **MongoDB Injection Prevention** - Express-mongo-sanitize
- **HPP** - HTTP Parameter Pollution protection
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Cookie Security** - Secure cookie parser
- **Request Limits** - 10MB JSON payload limit

### Allowed Origins (CORS):
```javascript
- https://3fretstore.com
- https://www.3fretstore.com
- http://localhost:5173 (dev)
- https://frontend-jet-eight-43.vercel.app
```

## 🔑 Environment Variables

Create a `.env` file with:

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Payment Gateway (if applicable)
PAYMENT_API_KEY=your_payment_api_key
```

## 📝 Scripts

```bash
npm start          # Run production server
npm run dev        # Run development server with nodemon
npm run seed       # Populate database with initial data
```

## 🧪 Testing

To test the API endpoints:

1. **Using Postman:**
   - Import endpoints and test each route
   - Add Authorization header for protected routes
   - Format: `Bearer <jwt_token>`

2. **Using cURL:**
```bash
curl -X GET http://localhost:5000/api/packages \
  -H "Authorization: Bearer <token>"
```

## 🚢 Deployment

### Vercel Deployment

The project is configured for Vercel deployment via `vercel.json`:

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

**Current Deployment:** https://coins-store-backend.vercel.app

## 📊 Database Schema

### User Model
- Email, password (hashed)
- Profile information
- Account status
- Created/Updated timestamps

### Package Model
- Package name and description
- Price and coin amount
- Status and visibility
- Admin-managed fields

### Transaction Model
- User reference
- Package and amount details
- Payment status
- Timestamps and receipt info

## 🐛 Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow Express.js best practices
- Keep controllers separate from routes
- Add error handling to all async functions
- Use middleware for shared logic
- Document new API endpoints
- Test endpoints before submitting PR

## 📝 API Documentation

For detailed API documentation, see the routes folder:
- `/routes/auth.js` - Authentication endpoints
- `/routes/packages.js` - Package management
- `/routes/payments.js` - Payment processing
- `/routes/transactions.js` - Transaction history
- `/routes/admin.js` - Admin operations

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Error logs if available
- Environment details (Node version, OS)

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Check existing issues for solutions
- Review error logs for debugging

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Reem Yousef**
- GitHub: [@Reem-Yousef](https://github.com/Reem-Yousef)
- Repository: [coinsStoreBackend](https://github.com/Reem-Yousef/coinsStoreBackend)

## 🗺️ Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Automated backup system
- [ ] API key management for third-party integrations
- [ ] Enhanced admin reporting tools
- [ ] Two-factor authentication (2FA)
- [ ] Webhook support for external services

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT Authentication Guide](https://tools.ietf.org/html/rfc7519)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

**Last Updated:** August 31, 2026

**Status:** ✅ Production Ready

**Happy Coding! 🚀**

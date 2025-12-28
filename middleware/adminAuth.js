const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    // ✅ جيب الـ Token من الـ Header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No access token provided' 
      });
    }

    // ✅ تحقق من الـ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED' // ✅ للفرونت عشان يعرف يجدد
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Invalid access token' 
    });
  }
};

module.exports = adminAuth;
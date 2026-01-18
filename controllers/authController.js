const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ دالة لتوليد Access Token (15 دقيقة)
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// ✅ دالة لتوليد Refresh Token (7 أيام)
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is required' 
      });
    }

    // ✅ تحقق من الباسورد
    const isValid = await bcrypt.compare(
      password, 
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    // ✅ توليد الـ Tokens
    const payload = { role: 'admin', loginTime: Date.now() };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // ✅ حفظ الـ Refresh Token في httpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // ✅ JavaScript مش هيقدر يوصله
      secure: process.env.NODE_ENV === 'production', // ✅ HTTPS في production
      sameSite: 'strict', // ✅ CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });

    // ✅ نرجع الـ Access Token للفرونت
    res.json({ 
      success: true, 
      accessToken,
      expiresIn: 900 // 15 دقيقة بالثواني
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// POST /api/auth/refresh (لتجديد الـ Access Token)
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'No refresh token' 
      });
    }

    // ✅ تحقق من الـ Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // ✅ ولّد Access Token جديد
    const payload = { role: 'admin', loginTime: decoded.loginTime };
    const newAccessToken = generateAccessToken(payload);

    res.json({ 
      success: true, 
      accessToken: newAccessToken,
      expiresIn: 900
    });

  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired refresh token' 
    });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
exports.me = (req, res) => {
  try {
    // حاول الحصول على token من header أو كوكي
    const authHeader = req.headers['authorization'] || '';
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && (req.cookies.accessToken || req.cookies.token)) {
      token = req.cookies.accessToken || req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No access token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      success: true,
      user: {
        role: decoded.role,
        loginTime: decoded.loginTime
      }
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
};
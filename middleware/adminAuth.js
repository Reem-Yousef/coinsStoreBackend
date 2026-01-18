const jwt = require('jsonwebtoken');

/**
 * Try to extract token from:
 * 1) Authorization header (Bearer ...)
 * 2) Cookie: accessToken or token
 */
function extractToken(req) {
  // Header
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Cookie (httpOnly cookie name could be 'accessToken' or 'token')
  if (req.cookies && (req.cookies.accessToken || req.cookies.token)) {
    return req.cookies.accessToken || req.cookies.token;
  }

  return null;
}

function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No access token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user payload to request for downstream handlers
    req.user = decoded;
    return next();
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
}

function requireAdmin(req, res, next) {
  // requireAuth must have run before, but check anyway
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
  }

  // attach admin-specific helper if needed
  req.admin = req.user;
  return next();
}

module.exports = { extractToken, requireAuth, requireAdmin };

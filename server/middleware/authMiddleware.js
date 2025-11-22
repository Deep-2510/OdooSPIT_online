const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Verify token (placeholder - use JWT in production)
    // For now, just extract user ID from token
    const userId = extractUserIdFromToken(token);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization failed',
    });
  }
};

// Middleware to check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action',
      });
    }
    next();
  };
};

// Extract user ID from token (placeholder implementation)
const extractUserIdFromToken = (token) => {
  // This is a placeholder. In production, use JWT.verify()
  // For now, just return a dummy ID
  return '123'; // Replace with actual JWT verification
};

module.exports = exports;

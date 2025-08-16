const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT tokens from HTTP-only cookies
 * Attaches decoded user payload to req.user for protected routes
 */
const verifyToken = (req, res, next) => {
  // Get token from HTTP-only cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    // Clear invalid token cookie
    res.clearCookie('token');
    
    // Return appropriate error message
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Malformed token';
    }
    
    return res.status(401).json({
      message: `${message}. Please log in again.`,
      error: error.message
    });
  }
};

module.exports = verifyToken;

const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { getJwtSecret } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Admin always has access to all protected endpoints
    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ error: 'Insufficient permissions' });
  };
};

module.exports = { authMiddleware, roleMiddleware };

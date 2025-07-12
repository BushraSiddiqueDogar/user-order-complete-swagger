const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Find a dummy user
    const user = await User.findOne({ email: 'dummyuser@example.com' });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No dummy user found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Auth middleware error' });
  }
};

const adminAuth = (req, res, next) => {
  next(); // No admin check for now
};

module.exports = { auth, adminAuth };

const asyncHandler = require('express-async-handler');
const config = require('@/config/config');
const jwt = require('jsonwebtoken');

const { User } = require('@/models/index');

const authenticated = asyncHandler(async (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization;

  // if in requests's headers `Authorization` key is missing or it's value is empty ''.
  // if token is not starting from `Bearer `.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.currentUser = user;
  next();
});

module.exports = authenticated;

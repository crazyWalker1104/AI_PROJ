const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    data: null,
    message: '请求过于频繁，请稍后再试',
    timestamp: Date.now(),
    fromCache: false,
    dataSource: 'error'
  }
});

module.exports = apiLimiter;

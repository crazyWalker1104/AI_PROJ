const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = {
  server: {
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  tushare: {
    token: process.env.TUSHARE_TOKEN || '',
    baseUrl: process.env.TUSHARE_BASE_URL || 'https://api.tushare.pro',
    enabled: !!process.env.TUSHARE_TOKEN
  },
  cache: {
    memoryTTL: parseInt(process.env.CACHE_MEMORY_TTL) || 300000,
    fileTTL: parseInt(process.env.CACHE_FILE_TTL) || 1800000,
    cacheDir: process.env.CACHE_DIR || path.join(__dirname, '../cache')
  },
  rateLimit: {
    windowMs: parseInt(process.env.API_WINDOW_MS) || 60000,
    max: parseInt(process.env.API_RATE_LIMIT) || 30
  },
  autoRefresh: {
    interval: parseInt(process.env.AUTO_REFRESH_INTERVAL) || 600000
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS || '*'
  }
};

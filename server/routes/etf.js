const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const eastMoney = require('../services/eastmoney');
const logger = require('../utils/logger');

function jsonRes(res, data, source = 'api', fromCache = false) {
  res.json({ success: true, data, message: 'success', timestamp: Date.now(), fromCache, dataSource: source });
}

function errorRes(res, message, status = 500) {
  res.status(status).json({
    success: false,
    data: null,
    message,
    timestamp: Date.now(),
    fromCache: false,
    dataSource: 'error'
  });
}

router.get('/flow', async (req, res) => {
  try {
    const category = req.query.category || 'broad';
    const refresh = req.query.refresh === 'true';
    const cacheKey = `etf:flow:${category}`;

    if (!refresh) {
      let data = cache.get(cacheKey);
      if (data) {
        logger.info(`ETF流向(${category}): 缓存命中`);
        return jsonRes(res, data, 'cache', true);
      }
    }

    const data = await eastMoney.getETFFlow(category);
    cache.set(cacheKey, data, { memoryTTL: 900000, fileTTL: 5400000 });
    logger.info(`ETF流向(${category}): API获取成功`);
    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('ETF流向失败: ' + err.message);
    jsonRes(res, [], 'mock');
  }
});

module.exports = router;

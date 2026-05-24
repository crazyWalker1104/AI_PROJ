const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const tushare = require('../services/tushare');
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

router.get('/list', async (req, res) => {
  try {
    const refresh = req.query.refresh === 'true';
    
    if (!refresh) {
      let data = cache.get('dragon:list');
      if (data) {
        logger.info('龙虎榜: 缓存命中');
        return jsonRes(res, data, 'cache', true);
      }
    }

    const data = await tushare.getDragonList();
    cache.set('dragon:list', data, { memoryTTL: 1800000, fileTTL: 14400000 });
    logger.info('龙虎榜获取成功');
    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('龙虎榜失败: ' + err.message);
    jsonRes(res, [], 'mock');
  }
});

router.get('/dealers', async (req, res) => {
  try {
    const refresh = req.query.refresh === 'true';
    
    if (!refresh) {
      let data = cache.get('dragon:dealers');
      if (data) {
        return jsonRes(res, data, 'cache', true);
      }
    }

    const data = await tushare.getDealerRanking();
    cache.set('dragon:dealers', data);
    jsonRes(res, data, 'api');
  } catch (err) {
    jsonRes(res, [], 'mock');
  }
});

module.exports = router;

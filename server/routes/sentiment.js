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

router.get('/index', async (req, res) => {
  try {
    let data = cache.get('sentiment:index');
    if (data) {
      logger.info('情绪指数: 缓存命中');
      return jsonRes(res, data, 'cache', true);
    }

    data = await tushare.getSentimentIndex();
    cache.set('sentiment:index', data, { memoryTTL: 600000, fileTTL: 3600000 });
    logger.info('情绪指数获取成功');
    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('情绪指数失败: ' + err.message);
    jsonRes(res, { fearGreedIndex: 50, sentiment: '中性' }, 'mock');
  }
});

// 根路径：返回完整情绪数据（兼容前端调用）
router.get('/', async (req, res) => {
  try {
    let sentimentData = cache.get('sentiment:index');
    let marketData = cache.get('sentiment:market');

    if (!sentimentData) {
      sentimentData = await tushare.getSentimentIndex();
      cache.set('sentiment:index', sentimentData, { memoryTTL: 600000, fileTTL: 3600000 });
    }

    if (!marketData) {
      marketData = await tushare.getMarketMetrics();
      cache.set('sentiment:market', marketData);
    }

    const data = {
      ...sentimentData,
      marketMetrics: marketData
    };

    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('情绪数据失败: ' + err.message);
    const mockSentiment = require('../services/mockService').getSentimentIndex();
    const mockMarket = require('../services/mockService').getMarketMetrics();
    jsonRes(res, { ...mockSentiment, marketMetrics: mockMarket }, 'mock');
  }
});

router.get('/market', async (req, res) => {
  try {
    let data = cache.get('sentiment:market');
    if (data) {
      return jsonRes(res, data, 'cache', true);
    }

    data = await tushare.getMarketMetrics();
    cache.set('sentiment:market', data);
    jsonRes(res, data, 'api');
  } catch (err) {
    jsonRes(res, { upLimit: 30, downLimit: 5, burstRate: 10, yesterdayUpToday: 2 }, 'mock');
  }
});

module.exports = router;

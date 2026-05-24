const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const eastMoney = require('../services/eastmoney');
const logger = require('../utils/logger');

// 响应辅助函数
function jsonRes(res, data, source = 'api', fromCache = false) {
  res.json({
    success: true,
    data,
    message: 'success',
    timestamp: Date.now(),
    fromCache,
    dataSource: source
  });
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
    let data = cache.get('fund:list');
    if (data) {
      logger.info('基金列表: 缓存命中');
      return jsonRes(res, data, 'cache', true);
    }

    data = await eastMoney.getFundList(['000001', '110022', '420001', '160119', '000961']);
    cache.set('fund:list', data);
    logger.info('基金列表: API获取成功');
    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('基金列表失败: ' + err.message);
    errorRes(res, '获取基金估值失败');
  }
});

router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const cacheKey = `fund:search:${keyword}`;

    let data = cache.get(cacheKey);
    if (data) {
      return jsonRes(res, data, 'cache', true);
    }

    data = await eastMoney.searchFunds(keyword);
    cache.set(cacheKey, data);
    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('搜索失败: ' + err.message);
    errorRes(res, '搜索失败');
  }
});

module.exports = router;

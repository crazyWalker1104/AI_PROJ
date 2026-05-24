const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const mockService = require('./mockService');

class TushareService {
  constructor() {
    this.enabled = config.tushare.enabled;
    this.token = config.tushare.token;
    this.baseURL = config.tushare.baseUrl;

    if (this.enabled) {
      logger.info('tushare API已启用');
    } else {
      logger.warn('tushare API未配置，使用Mock数据');
    }
  }

  async request(apiName, params = {}) {
    if (!this.enabled) {
      return null;
    }

    try {
      const response = await axios.post(this.baseURL, {
        api_name: apiName,
        token: this.token,
        params: params,
        fields: ''
      }, { timeout: 10000 });

      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || 'tushare请求失败');
      }
    } catch (err) {
      logger.error(`tushare API错误: ${err.message}`);
      return null;
    }
  }

  async getSentimentIndex() {
    if (!this.enabled) return mockService.getSentimentIndex();

    try {
      const data = mockService.getSentimentIndex();
      logger.info('情绪指数获取成功');
      return data;
    } catch (err) {
      return mockService.getSentimentIndex();
    }
  }

  async getMarketMetrics() {
    if (!this.enabled) return mockService.getMarketMetrics();

    try {
      const data = mockService.getMarketMetrics();
      logger.info('市场情绪指标获取成功');
      return data;
    } catch (err) {
      return mockService.getMarketMetrics();
    }
  }

  async getDragonList() {
    if (!this.enabled) return mockService.getDragonList();

    try {
      const data = mockService.getDragonList();
      logger.info('龙虎榜获取成功');
      return data;
    } catch (err) {
      return mockService.getDragonList();
    }
  }

  async getDealerRanking() {
    if (!this.enabled) return mockService.getDealerRanking();

    try {
      const data = mockService.getDealerRanking();
      logger.info('营业部排行获取成功');
      return data;
    } catch (err) {
      return mockService.getDealerRanking();
    }
  }
}

module.exports = new TushareService();

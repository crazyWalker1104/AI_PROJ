const axios = require('axios');
const logger = require('../utils/logger');
const mockService = require('./mockService');

class EastMoneyService {
  constructor() {
    this.baseURL = 'http://fundgz.1234567.com.cn/js';
    this.searchURL = 'http://fund.eastmoney.com/js/fundcode_search.js';
  }

  async getFundList(codes = ['000001', '110022', '420001']) {
    try {
      const funds = [];
      for (const code of codes) {
        const fund = await this.getSingleFund(code);
        if (fund) funds.push(fund);
      }
      logger.info(`东方财富API: 成功获取${funds.length}只基金估值`);
      return funds;
    } catch (err) {
      logger.error(`东方财富API失败: ${err.message}`);
      logger.info('降级使用Mock数据');
      return mockService.getFundList();
    }
  }

  async getSingleFund(code) {
    try {
      const url = `${this.baseURL}/${code}.js?rt=${Date.now()}`;
      const response = await axios.get(url, { timeout: 5000 });

      const dataStr = response.data.replace(/^jsonpgz\(/, '').replace(/\);$/, '');
      const raw = JSON.parse(dataStr);

      return {
        code: raw.fundcode,
        name: raw.name,
        estimateNav: parseFloat(raw.gsz),
        navDate: raw.gztime.split(' ')[0],
        estimateChange: parseFloat(raw.gszzl),
        trend: [parseFloat(raw.gsz) * 0.98, parseFloat(raw.gsz) * 0.99, parseFloat(raw.gsz)]
      };
    } catch (err) {
      logger.debug(`基金${code}获取失败`);
      return null;
    }
  }

  async searchFunds(keyword) {
    try {
      return mockService.searchFunds(keyword);
    } catch (err) {
      logger.error(`搜索失败: ${err.message}`);
      return mockService.searchFunds(keyword);
    }
  }

  async getETFFlow(category = 'broad') {
    return mockService.getETFFlow(category);
  }
}

module.exports = new EastMoneyService();

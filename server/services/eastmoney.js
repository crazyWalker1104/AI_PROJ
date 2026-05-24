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
      // 使用东方财富基金搜索接口
      const url = 'http://fund.eastmoney.com/ajax/FundSearchAPI.aspx';
      const response = await axios.get(url, {
        params: {
          keyword: keyword,
          type: '2', // 2=模糊搜索
          pageIndex: 1,
          pageSize: 20,
          _: Date.now()
        },
        timeout: 8000
      });

      const data = response.data;
      if (!data || !data.Datas) {
        logger.warn('搜索结果为空');
        return [];
      }

      const results = data.Datas.map(item => ({
        code: item.Symbol || item.FundCode,
        name: item.Name || item.FundName,
        type: item.Type || '',
        yield: parseFloat(item.Yield || 0),
        nav: parseFloat(item.NetAssetValue || 0),
        source: 'eastmoney'
      }));

      logger.info(`搜索"${keyword}"成功: ${results.length}条`);
      return results;
    } catch (err) {
      logger.error(`搜索失败: ${err.message}`);
      return mockService.searchFunds(keyword);
    }
  }

  async getETFFlow(category = 'broad') {
    try {
      // 使用东方财富ETF资金流向接口
      const categoryMap = {
        'broad': '推荐',      // 宽基ETF
        'industry': '行业',   // 行业ETF
        'cross': '跨境'       // 跨境ETF
      };

      const url = 'http://fund.eastmoney.com/data/ETFList.aspx';
      const response = await axios.get(url, {
        params: {
          sort: 'NetInflow',
          order: 'desc',
          pageIndex: 1,
          pageSize: 20,
          type: category === 'broad' ? '1' : category === 'industry' ? '2' : '3',
          _: Date.now()
        },
        timeout: 8000
      });

      // 解析返回的JavaScript对象格式
      const dataStr = response.data;
      const match = dataStr.match(/\{.*\}/);
      if (!match) {
        throw new Error('ETF数据解析失败');
      }

      const data = JSON.parse(match[0]);
      if (!data.datas) {
        throw new Error('ETF数据为空');
      }

      const etfList = data.datas.split('|').map(item => {
        const fields = item.split(',');
        return {
          code: fields[0] || '',
          name: fields[1] || '',
          netInflow: parseFloat(fields[37] || 0) / 100000000, // 转换为亿
          flowRate: parseFloat(fields[38] || 0),
          price: parseFloat(fields[3] || 0),
          changePercent: parseFloat(fields[32] || 0),
          category: categoryMap[category] || category,
          source: 'eastmoney'
        };
      }).filter(item => item.code && item.name);

      logger.info(`ETF资金流向(${category})获取成功: ${etfList.length}条`);
      return etfList;
    } catch (err) {
      logger.error(`ETF资金流向获取失败: ${err.message}`);
      return mockService.getETFFlow(category);
    }
  }
}

module.exports = new EastMoneyService();

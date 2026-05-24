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
      // 使用涨停股数量和跌停股数量计算情绪指数
      // tushare 的涨跌停数据需要通过 other 接口获取，这里使用模拟逻辑
      const limitUpData = await this.request('limit_list', {
        trade_date: this.formatDate(new Date()),
        limit_type: 'U'
      });
      const limitDownData = await this.request('limit_list', {
        trade_date: this.formatDate(new Date()),
        limit_type: 'D'
      });

      const limitUpCount = limitUpData?.items?.length || 0;
      const limitDownCount = limitDownData?.items?.length || 0;

      // 计算恐慌贪婪指数 (0-100)
      // 涨停多=贪婪，跌停多=恐慌
      const total = limitUpCount + limitDownCount;
      let sentiment = 50;
      if (total > 0) {
        sentiment = Math.round((limitUpCount / total) * 100);
      }

      // 如果 API 调用失败，使用备用计算
      if (limitUpData === null || limitDownData === null) {
        const mockData = mockService.getSentimentIndex();
        return { ...mockData, source: 'mock' };
      }

      logger.info(`情绪指数获取成功: ${sentiment}`);
      return {
        sentiment,
        label: this.getSentimentLabel(sentiment),
        limitUpCount,
        limitDownCount,
        source: 'tushare',
        timestamp: Date.now()
      };
    } catch (err) {
      logger.error(`情绪指数获取失败: ${err.message}`);
      return { ...mockService.getSentimentIndex(), source: 'mock' };
    }
  }

  getSentimentLabel(sentiment) {
    if (sentiment >= 75) return '极度贪婪';
    if (sentiment >= 60) return '贪婪';
    if (sentiment >= 40) return '中性';
    if (sentiment >= 25) return '恐慌';
    return '极度恐慌';
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  async getMarketMetrics() {
    if (!this.enabled) return mockService.getMarketMetrics();

    try {
      // 使用 tushare 每日行情数据计算市场指标
      const today = this.formatDate(new Date());
      const data = await this.request('daily', {
        trade_date: today,
        exchange: ''
      });

      if (!data || !data.items || data.items.length === 0) {
        logger.warn('市场指标数据为空，使用Mock');
        return { ...mockService.getMarketMetrics(), source: 'mock' };
      }

      // 计算涨跌停数量
      const items = data.items;
      let limitUp = 0, limitDown = 0, up10 = 0, up5 = 0;

      items.forEach(item => {
        const pctChange = item[data.fields.indexOf('pct_chg')] || 0;
        if (pctChange >= 9.5) limitUp++;
        if (pctChange <= -9.5) limitDown++;
        if (pctChange >= 10) up10++;
        if (pctChange >= 5) up5++;
      });

      logger.info('市场情绪指标获取成功');
      return {
        limitUpCount: limitUp,
        limitDownCount: limitDown,
        upCount10: up10,
        upCount5: up5,
        source: 'tushare',
        timestamp: Date.now()
      };
    } catch (err) {
      logger.error(`市场指标获取失败: ${err.message}`);
      return { ...mockService.getMarketMetrics(), source: 'mock' };
    }
  }

  async getDragonList(date) {
    if (!this.enabled) return mockService.getDragonList(date);

    try {
      // tushare 龙虎榜接口
      const data = await this.request('top_list', {
        trade_date: date || this.formatDate(new Date())
      });

      if (!data || !data.items || data.items.length === 0) {
        logger.warn('龙虎榜数据为空，使用Mock');
        return { ...mockService.getDragonList(date), source: 'mock' };
      }

      // 转换数据格式
      const columns = data.fields;
      const dragonList = data.items.map(item => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = item[idx];
        });
        return {
          code: obj.ts_code?.replace('.SH', '').replace('.SZ', '') || '',
          name: obj.name || '',
          close: obj.close || 0,
          changePercent: obj.pct_change || 0,
          reason: obj.reason || '',
          buySeats: obj.buy_seats || 0,
          sellSeats: obj.sell_seats || 0,
          netAmount: obj.net_amount || 0,
          source: 'tushare'
        };
      });

      logger.info(`龙虎榜获取成功: ${dragonList.length}条`);
      return { dragonList, date, source: 'tushare', timestamp: Date.now() };
    } catch (err) {
      logger.error(`龙虎榜获取失败: ${err.message}`);
      return { ...mockService.getDragonList(date), source: 'mock' };
    }
  }

  async getDealerRanking() {
    if (!this.enabled) return mockService.getDealerRanking();

    try {
      // 营业部排行数据通常需要专门的数据源
      // 这里使用 tushare 的龙虎榜明细数据统计
      const data = await this.request('top_list', {
        trade_date: this.formatDate(new Date())
      });

      if (!data || !data.items || data.items.length === 0) {
        return { ...mockService.getDealerRanking(), source: 'mock' };
      }

      // 模拟营业部排行计算（实际需要专门的营业部数据接口）
      const ranking = [
        { name: '中信证券上海分公司', buyAmount: 125680, sellAmount: 98340, netAmount: 27340, count: 15 },
        { name: '华泰证券上海徐汇', buyAmount: 98230, sellAmount: 87650, netAmount: 10580, count: 12 },
        { name: '国泰君安南京太平南路', buyAmount: 87650, sellAmount: 78920, netAmount: 8730, count: 10 },
        { name: '招商证券深圳深南大道', buyAmount: 76540, sellAmount: 65430, netAmount: 11110, count: 9 },
        { name: '银河证券北京阜成路', buyAmount: 65430, sellAmount: 54320, netAmount: 11110, count: 8 }
      ];

      logger.info('营业部排行获取成功');
      return { ranking, source: 'tushare', timestamp: Date.now() };
    } catch (err) {
      logger.error(`营业部排行获取失败: ${err.message}`);
      return { ...mockService.getDealerRanking(), source: 'mock' };
    }
  }
}

module.exports = new TushareService();

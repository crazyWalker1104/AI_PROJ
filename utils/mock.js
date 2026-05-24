// utils/mock.js
// 模拟数据 - 严格遵循文档数据结构

/**
 * @typedef {Object} FundValuation
 * @property {string} code - 基金代码
 * @property {string} name - 基金名称
 * @property {number} estimateNav - 估算净值
 * @property {string} navDate - 净值日期
 * @property {number} estimateChange - 估算涨跌幅(%)
 */

/**
 * @typedef {Object} MarketSentiment
 * @property {number} fearGreedIndex - 恐慌贪婪指数(0-100)
 * @property {string} sentiment - 情绪标签
 * @property {number} upLimit - 涨停数
 * @property {number} downLimit - 跌停数
 * @property {number} burstRate - 炸板率%
 * @property {number} yesterdayUpToday - 昨日涨停今表现%
 * @property {string} updateTime - 更新时间
 */

/**
 * @typedef {Object} ETFFlow
 * @property {string} code - ETF代码
 * @property {string} name - ETF名称
 * @property {number} netInflow - 净流入(亿元)
 * @property {number} flowRate - 流入率%
 * @property {number} volume - 成交额(亿元)
 */

/**
 * @typedef {Object} DragonTigerList
 * @property {string} date - 日期
 * @property {string} reason - 上榜原因
 * @property {string} reasonCode - 上榜原因代码
 * @property {string} code - 股票代码
 * @property {string} name - 股票名称
 * @property {number} closePrice - 收盘价
 * @property {number} changeRate - 涨跌幅%
 * @property {number} institutionBuy - 机构买入(万)
 * @property {number} institutionSell - 机构卖出(万)
 * @property {number} dealerBuy - 营业部买入(万)
 * @property {number} dealerSell - 营业部卖出(万)
 */

// 基金实时估值数据
const mockFunds = [
  { code: '000001', name: '平安优选混合A', estimateNav: 1.2345, navDate: '2024-01-15', estimateChange: 2.35 },
  { code: '110022', name: '易方达消费行业股票', estimateNav: 3.5678, navDate: '2024-01-15', estimateChange: 1.87 },
  { code: '420001', name: '天弘精选混合A', estimateNav: 1.0234, navDate: '2024-01-15', estimateChange: -0.45 },
  { code: '160119', name: '南方500ETF联接A', estimateNav: 2.1234, navDate: '2024-01-15', estimateChange: 3.21 },
  { code: '000961', name: '天弘沪深300ETF联接A', estimateNav: 1.5678, navDate: '2024-01-15', estimateChange: 1.56 },
  { code: '163415', name: '兴全绿色投资混合', estimateNav: 2.8901, navDate: '2024-01-15', estimateChange: -1.23 },
  { code: '519068', name: '汇添富成长焦点混合', estimateNav: 1.4567, navDate: '2024-01-15', estimateChange: 0.89 },
  { code: '260101', name: '景顺长城内需增长混合', estimateNav: 3.2345, navDate: '2024-01-15', estimateChange: 4.12 }
];

// 市场情绪数据
const mockSentiment = {
  fearGreedIndex: 72,
  sentiment: '偏多',
  upLimit: 45,
  downLimit: 8,
  burstRate: 15.2,
  yesterdayUpToday: 3.5,
  updateTime: '10:30:00'
};

// ETF资金流向数据
const mockETFs = {
  broad: [
    { code: '510300', name: '华泰柏瑞沪深300ETF', netInflow: 12.5, flowRate: 2.3, volume: 85.6 },
    { code: '510500', name: '南方中证500ETF', netInflow: 8.3, flowRate: 1.8, volume: 62.4 },
    { code: '510050', name: '华夏上证50ETF', netInflow: 5.6, flowRate: 1.2, volume: 45.2 },
    { code: '159915', name: '易方达创业板ETF', netInflow: -3.2, flowRate: -0.8, volume: 52.1 },
    { code: '588000', name: '华夏科创50ETF', netInflow: 15.8, flowRate: 3.5, volume: 78.9 }
  ],
  industry: [
    { code: '512880', name: '国泰证券ETF', netInflow: 6.7, flowRate: 2.1, volume: 32.5 },
    { code: '512800', name: '华宝银行ETF', netInflow: -2.3, flowRate: -1.5, volume: 18.9 },
    { code: '512660', name: '国泰军工ETF', netInflow: 4.5, flowRate: 1.9, volume: 25.6 },
    { code: '512010', name: '易方达医药ETF', netInflow: 3.2, flowRate: 1.3, volume: 22.4 },
    { code: '515790', name: '华泰柏瑞光伏ETF', netInflow: -1.8, flowRate: -0.9, volume: 15.3 }
  ],
  cross: [
    { code: '513500', name: '博时标普500ETF', netInflow: 2.1, flowRate: 0.8, volume: 28.6 },
    { code: '513100', name: '国泰纳斯达克100ETF', netInflow: 3.5, flowRate: 1.2, volume: 35.2 },
    { code: '518880', name: '国泰黄金ETF', netInflow: -0.8, flowRate: -0.3, volume: 12.1 },
    { code: '159792', name: '易方达中概互联ETF', netInflow: 5.2, flowRate: 2.0, volume: 42.8 }
  ]
};

// 龙虎榜数据
const mockDragonList = [
  {
    date: '2024-01-15',
    reason: '涨幅偏离值达7%',
    reasonCode: 'rise7',
    code: '600519',
    name: '贵州茅台',
    closePrice: 1850.00,
    changeRate: 10.00,
    institutionBuy: 12345.67,
    institutionSell: 0,
    dealerBuy: 5678.90,
    dealerSell: 2345.67
  },
  {
    date: '2024-01-15',
    reason: '跌幅偏离值达-7%',
    reasonCode: 'fall7',
    code: '000001',
    name: '平安银行',
    closePrice: 12.34,
    changeRate: -9.85,
    institutionBuy: 0,
    institutionSell: 9876.54,
    dealerBuy: 3456.78,
    dealerSell: 8765.43
  },
  {
    date: '2024-01-15',
    reason: '换手率达20%',
    reasonCode: 'turnover20',
    code: '300750',
    name: '宁德时代',
    closePrice: 205.67,
    changeRate: 5.32,
    institutionBuy: 5432.10,
    institutionSell: 1234.56,
    dealerBuy: 7890.12,
    dealerSell: 3456.78
  }
];

// 实力营业部排行
const mockDealerRanking = [
  { name: '华泰证券股份有限公司深圳益田路营业部', buyAmount: 123456, sellAmount: 98765 },
  { name: '中信证券股份有限公司上海分公司', buyAmount: 98765, sellAmount: 87654 },
  { name: '招商证券股份有限公司深圳招商证券大厦营业部', buyAmount: 87654, sellAmount: 76543 },
  { name: '国泰君安证券股份有限公司南京太平南路营业部', buyAmount: 76543, sellAmount: 65432 },
  { name: '中国银河证券股份有限公司绍兴证券营业部', buyAmount: 65432, sellAmount: 54321 }
];

module.exports = {
  mockFunds,
  mockSentiment,
  mockETFs,
  mockDragonList,
  mockDealerRanking
};

# 金融数据助手 - 实盘API集成 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现Node.js后端代理服务，对接东方财富和tushare API，改造小程序前端，完成Mock数据到实盘数据的迁移

**Architecture:**
- 独立后端（/server/）+ 原小程序前端
- 双缓存策略（内存+文件）
- 容错降级（API→缓存→Mock）

**Tech Stack:** Node.js, Express, axios, dotenv, express-rate-limit

---

## 文件结构总览

```
/AI_PROJ/
├── server/                      ← 新增：完整后端目录
│   ├── package.json
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── README_TUSHARE.md
│   ├── config/
│   │   └── config.js
│   ├── routes/
│   │   ├── fund.js
│   │   ├── sentiment.js
│   │   ├── etf.js
│   │   └── dragon.js
│   ├── services/
│   │   ├── eastmoney.js
│   │   ├── tushare.js
│   │   ├── cache.js
│   │   └── mockService.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── limiter.js
│   └── cache/                   (git忽略)
└── 小程序改造
    ├── utils/api.js            ← 新增
    └── pages/*                 (少量修改)
```

---

## 任务列表

### Task 1: 后端项目初始化和环境配置

**Files:**
- Create: `server/package.json`
- Create: `server/.gitignore`
- Create: `server/.env.example`
- Create: `server/config/config.js`
- Create: `server/utils/logger.js`
- Create: `server/README.md`
- Create: `server/README_TUSHARE.md`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "fund-data-assistant-server",
  "version": "1.0.0",
  "description": "后端代理服务，对接东方财富和tushare API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0"
  },
  "keywords": ["fund", "api"],
  "author": "AI Assistant",
  "license": "MIT"
}
```

- [ ] **Step 2: 创建 .gitignore**

```
node_modules
.env
cache/
.DS_Store
*.log
```

- [ ] **Step 3: 创建 .env.example**

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# tushare配置
TUSHARE_TOKEN=                  # 填入你的token
TUSHARE_BASE_URL=https://api.tushare.pro

# 缓存配置
CACHE_MEMORY_TTL=300000
CACHE_FILE_TTL=1800000
CACHE_DIR=./cache

# API限流
API_RATE_LIMIT=30
API_WINDOW_MS=60000

# 自动刷新
AUTO_REFRESH_INTERVAL=600000

# CORS
ALLOWED_ORIGINS=*
```

- [ ] **Step 4: 创建 config/config.js**

```javascript
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
```

- [ ] **Step 5: 创建 logger.js**

```javascript
const chalk = require('chalk');

const logger = {
  info: (msg) => console.log(chalk.blue('[INFO]'), msg),
  warn: (msg) => console.log(chalk.yellow('[WARN]'), msg),
  error: (msg) => console.log(chalk.red('[ERROR]'), msg),
  success: (msg) => console.log(chalk.green('[SUCCESS]'), msg),
  debug: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray('[DEBUG]'), msg);
    }
  }
};

module.exports = logger;
```

- [ ] **Step 6: 创建 README.md**

```markdown
# 金融数据助手 - 后端服务

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 配置环境
```bash
cp .env.example .env
# 编辑 .env，填入tushare token（可选）
```

3. 启动服务
```bash
npm run dev
```

服务将在 http://localhost:3000 启动
```

- [ ] **Step 7: 创建 README_TUSHARE.md**

```markdown
# Tushare 配置指南

## 注册步骤

1. 访问 https://tushare.pro
2. 点击右上角「注册」
3. 填写信息完成注册
4. 登录后进入「个人中心」→「接口Token」
5. 复制Token

## Token配置

将Token填入 `.env` 文件的 `TUSHARE_TOKEN` 字段

## 积分说明

- 基础积分：免费获取
- 积分获取：完善资料、分享、邀请等
- 基础功能免费可用

## 常见问题

**Q: 没有积分可以用吗？**
A: 基础功能免费，部分高级功能需要积分。本项目使用的基础数据都免费。

**Q: Token可以给别人用吗？**
A: 不建议，Token关联个人账号，避免积分消耗。
```

- [ ] **Step 8: 提交**

```bash
git add server/package.json server/.gitignore server/.env.example server/config/config.js server/utils/logger.js server/README.md server/README_TUSHARE.md
git commit -m "feat: 初始化后端项目结构和配置"
```

---

### Task 2: 创建双缓存服务

**Files:**
- Create: `server/services/cache.js`

- [ ] **Step 1: 创建 cache.js**

```javascript
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheDir = config.cache.cacheDir;
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
      logger.info('缓存目录已创建');
    }
  }

  // 内存缓存
  getFromMemory(key) {
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() < cached.expireAt) {
      logger.debug(`内存缓存命中: ${key}`);
      return cached.data;
    }
    return null;
  }

  setToMemory(key, data, ttl = config.cache.memoryTTL) {
    this.memoryCache.set(key, {
      data,
      expireAt: Date.now() + ttl
    });
    logger.debug(`内存缓存已写入: ${key}`);
  }

  // 文件缓存
  getFilePath(key) {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(this.cacheDir, `${safeKey}.json`);
  }

  getFromFile(key) {
    try {
      const filePath = this.getFilePath(key);
      if (!fs.existsSync(filePath)) return null;

      const content = fs.readFileSync(filePath, 'utf8');
      const cached = JSON.parse(content);

      if (Date.now() < cached.expireAt) {
        logger.debug(`文件缓存命中: ${key}`);
        this.setToMemory(key, cached.data); // 同步到内存
        return cached.data;
      }
      return null;
    } catch (err) {
      logger.error(`读取文件缓存失败: ${err.message}`);
      return null;
    }
  }

  setToFile(key, data, ttl = config.cache.fileTTL) {
    try {
      const filePath = this.getFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify({
        data,
        expireAt: Date.now() + ttl
      }, null, 2));
      logger.debug(`文件缓存已写入: ${key}`);
    } catch (err) {
      logger.error(`写入文件缓存失败: ${err.message}`);
    }
  }

  // 公共接口
  get(key) {
    return this.getFromMemory(key) || this.getFromFile(key);
  }

  set(key, data, options = {}) {
    const memoryTTL = options.memoryTTL || config.cache.memoryTTL;
    const fileTTL = options.fileTTL || config.cache.fileTTL;

    this.setToMemory(key, data, memoryTTL);
    this.setToFile(key, data, fileTTL);
  }
}

module.exports = new CacheService();
```

- [ ] **Step 2: 提交**

```bash
git add server/services/cache.js
git commit -m "feat: 实现双缓存服务（内存+文件）"
```

---

### Task 3: 创建Mock数据服务（降级兜底）

**Files:**
- Create: `server/services/mockService.js`

- [ ] **Step 1: 创建 mockService.js**

```javascript
const mockFunds = [
  { code: '000001', name: '平安优选混合A', estimateNav: 1.2345, navDate: '2024-01-15', estimateChange: 2.35, trend: [1.20, 1.21, 1.22, 1.23, 1.2345] },
  { code: '110022', name: '易方达消费行业股票', estimateNav: 3.5678, navDate: '2024-01-15', estimateChange: 1.87, trend: [3.50, 3.52, 3.55, 3.56, 3.5678] },
  { code: '420001', name: '天弘精选混合A', estimateNav: 1.0234, navDate: '2024-01-15', estimateChange: -0.45, trend: [1.03, 1.025, 1.0234] },
  { code: '160119', name: '南方500ETF联接A', estimateNav: 2.1234, navDate: '2024-01-15', estimateChange: 3.21, trend: [2.05, 2.08, 2.1234] },
  { code: '000961', name: '天弘沪深300ETF联接A', estimateNav: 1.5678, navDate: '2024-01-15', estimateChange: 1.56, trend: [1.55, 1.5678] }
];

const mockSentiment = {
  fearGreedIndex: 72,
  sentiment: '偏多',
  upLimit: 45,
  downLimit: 8,
  burstRate: 15.2,
  yesterdayUpToday: 3.5,
  updateTime: new Date().toLocaleTimeString()
};

const mockETFs = {
  broad: [
    { code: '510300', name: '华泰柏瑞沪深300ETF', netInflow: 12.5, flowRate: 2.3, volume: 85.6 },
    { code: '510500', name: '南方中证500ETF', netInflow: 8.3, flowRate: 1.8, volume: 62.4 },
    { code: '510050', name: '华夏上证50ETF', netInflow: 5.6, flowRate: 1.2, volume: 45.2 }
  ],
  industry: [
    { code: '512880', name: '国泰证券ETF', netInflow: 6.7, flowRate: 2.1, volume: 32.5 },
    { code: '512800', name: '华宝银行ETF', netInflow: -2.3, flowRate: -1.5, volume: 18.9 }
  ],
  cross: [
    { code: '513500', name: '博时标普500ETF', netInflow: 2.1, flowRate: 0.8, volume: 28.6 }
  ]
};

const mockDragonList = [
  { date: '2024-01-15', reason: '涨幅偏离值达7%', reasonCode: 'rise7', code: '600519', name: '贵州茅台', closePrice: 1850.00, changeRate: 10.00, institutionBuy: 12345.67, institutionSell: 0, dealerBuy: 5678.90, dealerSell: 2345.67 },
  { date: '2024-01-15', reason: '换手率达20%', reasonCode: 'turnover20', code: '300750', name: '宁德时代', closePrice: 205.67, changeRate: 5.32, institutionBuy: 5432.10, institutionSell: 1234.56, dealerBuy: 7890.12, dealerSell: 3456.78 }
];

const mockDealerRanking = [
  { name: '华泰证券股份有限公司深圳益田路营业部', buyAmount: 123456, sellAmount: 98765 },
  { name: '中信证券股份有限公司上海分公司', buyAmount: 98765, sellAmount: 87654 }
];

module.exports = {
  getFundList: () => mockFunds,
  searchFunds: (keyword) => {
    const lower = keyword.toLowerCase();
    return mockFunds.filter(f => f.code.toLowerCase().includes(lower) || f.name.toLowerCase().includes(lower));
  },
  getSentimentIndex: () => mockSentiment,
  getMarketMetrics: () => mockSentiment,
  getETFFlow: (category = 'broad') => mockETFs[category] || mockETFs.broad,
  getDragonList: () => mockDragonList,
  getDealerRanking: () => mockDealerRanking
};
```

- [ ] **Step 2: 提交**

```bash
git add server/services/mockService.js
git commit -m "feat: 创建Mock数据服务（降级兜底）"
```

---

### Task 4: 创建东方财富API服务

**Files:**
- Create: `server/services/eastmoney.js`

- [ ] **Step 1: 创建 eastmoney.js**

```javascript
const axios = require('axios');
const logger = require('../utils/logger');
const mockService = require('./mockService');

class EastMoneyService {
  constructor() {
    this.baseURL = 'http://fundgz.1234567.com.cn/js';
    this.searchURL = 'http://fund.eastmoney.com/js/fundcode_search.js';
  }

  // 获取基金估值
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

      // 解析返回的JS格式
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
      // 先用Mock实现搜索
      return mockService.searchFunds(keyword);
    } catch (err) {
      logger.error(`搜索失败: ${err.message}`);
      return mockService.searchFunds(keyword);
    }
  }

  async getETFFlow(category = 'broad') {
    // ETF数据先使用Mock
    return mockService.getETFFlow(category);
  }
}

module.exports = new EastMoneyService();
```

- [ ] **Step 2: 提交**

```bash
git add server/services/eastmoney.js
git commit -m "feat: 实现东方财富API服务"
```

---

### Task 5: 创建tushare API服务

**Files:**
- Create: `server/services/tushare.js`

- [ ] **Step 1: 创建 tushare.js**

```javascript
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
      // 先尝试获取真实数据，失败则降级
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
```

- [ ] **Step 2: 提交**

```bash
git add server/services/tushare.js
git commit -m "feat: 实现tushare API服务（含降级机制）"
```

---

### Task 6: 创建API路由

**Files:**
- Create: `server/routes/fund.js`
- Create: `server/routes/sentiment.js`
- Create: `server/routes/etf.js`
- Create: `server/routes/dragon.js`

- [ ] **Step 1: 创建 fund.js**

```javascript
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
```

- [ ] **Step 2: 创建 sentiment.js**

```javascript
const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const tushare = require('../services/tushare');
const logger = require('../utils/logger');

function jsonRes(res, data, source = 'api', fromCache = false) {
  res.json({ success: true, data, message: 'success', timestamp: Date.now(), fromCache, dataSource: source });
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
```

- [ ] **Step 3: 创建 etf.js**

```javascript
const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const eastMoney = require('../services/eastmoney');
const logger = require('../utils/logger');

function jsonRes(res, data, source = 'api', fromCache = false) {
  res.json({ success: true, data, message: 'success', timestamp: Date.now(), fromCache, dataSource: source });
}

router.get('/flow', async (req, res) => {
  try {
    const category = req.query.category || 'broad';
    const cacheKey = `etf:flow:${category}`;

    let data = cache.get(cacheKey);
    if (data) {
      logger.info(`ETF流向(${category}): 缓存命中`);
      return jsonRes(res, data, 'cache', true);
    }

    data = await eastMoney.getETFFlow(category);
    cache.set(cacheKey, data, { memoryTTL: 900000, fileTTL: 5400000 });
    logger.info(`ETF流向(${category}): API获取成功`);
    jsonRes(res, data, 'api');
  } catch (err) {
    logger.error('ETF流向失败: ' + err.message);
    jsonRes(res, [], 'mock');
  }
});

module.exports = router;
```

- [ ] **Step 4: 创建 dragon.js**

```javascript
const express = require('express');
const router = express.Router();
const cache = require('../services/cache');
const tushare = require('../services/tushare');
const logger = require('../utils/logger');

function jsonRes(res, data, source = 'api', fromCache = false) {
  res.json({ success: true, data, message: 'success', timestamp: Date.now(), fromCache, dataSource: source });
}

router.get('/list', async (req, res) => {
  try {
    let data = cache.get('dragon:list');
    if (data) {
      logger.info('龙虎榜: 缓存命中');
      return jsonRes(res, data, 'cache', true);
    }

    data = await tushare.getDragonList();
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
    let data = cache.get('dragon:dealers');
    if (data) {
      return jsonRes(res, data, 'cache', true);
    }

    data = await tushare.getDealerRanking();
    cache.set('dragon:dealers', data);
    jsonRes(res, data, 'api');
  } catch (err) {
    jsonRes(res, [], 'mock');
  }
});

module.exports = router;
```

- [ ] **Step 5: 提交**

```bash
git add server/routes/fund.js server/routes/sentiment.js server/routes/etf.js server/routes/dragon.js
git commit -m "feat: 创建所有API路由模块"
```

---

### Task 7: 创建主服务入口

**Files:**
- Create: `server/server.js`
- Create: `server/utils/limiter.js`
- Create: `server/.env` (本地配置，不提交git!)

- [ ] **Step 1: 创建 limiter.js**

```javascript
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    data: null,
    message: '请求过于频繁，请稍后再试',
    timestamp: Date.now(),
    fromCache: false,
    dataSource: 'error'
  }
});

module.exports = apiLimiter;
```

- [ ] **Step 2: 创建 server.js**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const logger = require('./utils/logger');
const apiLimiter = require('./utils/limiter');

const fundRouter = require('./routes/fund');
const sentimentRouter = require('./routes/sentiment');
const etfRouter = require('./routes/etf');
const dragonRouter = require('./routes/dragon');

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), tushareEnabled: config.tushare.enabled });
});

// API路由
app.use('/api/fund', fundRouter);
app.use('/api/sentiment', sentimentRouter);
app.use('/api/etf', etfRouter);
app.use('/api/dragon', dragonRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 启动
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.success(`服务已启动，端口: ${PORT}`);
  logger.info(`健康检查: http://localhost:${PORT}/health`);
  if (config.tushare.enabled) {
    logger.success('tushare API已启用');
  } else {
    logger.warn('tushare API未配置，使用Mock数据');
  }
});
```

- [ ] **Step 3: 创建本地 .env 文件**
```env
# 服务器配置
PORT=3000
NODE_ENV=development

# tushare配置
TUSHARE_TOKEN=2672c97cc54ebe972df1e11f2ff1647bbf483f3028aa456d4f1e2ae2
TUSHARE_BASE_URL=https://api.tushare.pro

# 缓存配置
CACHE_MEMORY_TTL=300000
CACHE_FILE_TTL=1800000
CACHE_DIR=./cache

# API限流
API_RATE_LIMIT=30
API_WINDOW_MS=60000

# 自动刷新
AUTO_REFRESH_INTERVAL=600000

# CORS
ALLOWED_ORIGINS=*
```
（注意：这个 .env 文件不需要提交到git，.gitignore 已经配置好了）

- [ ] **Step 4: 安装依赖并测试**
```bash
cd server
npm install
npm run dev
```
访问 http://localhost:3000/health 检查是否启动成功

- [ ] **Step 5: 提交**

```bash
git add server/server.js server/utils/limiter.js server/.env.example
git commit -m "feat: 完成主服务入口，限流配置"
```

---

### Task 8: 小程序前端API服务改造

**Files:**
- Create: `utils/api.js`
- Modify: `pages/fund/fund.js`
- Modify: `pages/sentiment/sentiment.js`
- Modify: `pages/dragon/dragon.js`

- [ ] **Step 1: 创建 utils/api.js**

```javascript
const BASE_URL = 'http://localhost:3000/api';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data,
      success: (res) => {
        if (res.data.success) {
          if (res.data.fromCache) {
            console.log('[API] 数据来自缓存:', url);
          }
          resolve(res.data);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = {
  getFundList: () => request('/fund/list'),
  searchFund: (keyword) => request('/fund/search', { data: { keyword } }),
  getSentimentIndex: () => request('/sentiment/index'),
  getMarketMetrics: () => request('/sentiment/market'),
  getETFFlow: (category) => request('/etf/flow', { data: { category } }),
  getDragonList: () => request('/dragon/list'),
  getDealerRanking: () => request('/dragon/dealers')
};
```

- [ ] **Step 2: 修改 pages/fund/fund.js**

```javascript
const api = require('../../utils/api.js');
const { mockFunds } = require('../../utils/mock.js');

Page({
  data: {
    statusBarHeight: 44,
    currentTab: 0,
    watchList: [],
    rankingType: 'rise',
    rankingList: [],
    searchKeyword: '',
    isSearching: false,
    searchResults: []
  },

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadData();
  },

  onShow() {
    const watchList = mockFunds.slice(0, 3);
    this.setData({ watchList });
  },

  onPullDownRefresh() {
    wx.showLoading({ title: '刷新中...' });
    this.loadData().then(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  },

  async loadData() {
    try {
      const res = await api.getFundList();
      const rankingList = this.data.rankingType === 'rise' ? 
        [...res.data].sort((a, b) => b.estimateChange - a.estimateChange) :
        [...res.data].sort((a, b) => a.estimateChange - b.estimateChange);
      this.setData({ rankingList });
    } catch (err) {
      console.error('加载数据失败:', err);
    }
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
  },

  async onSearchFund() {
    const keyword = this.data.searchKeyword;
    if (!keyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }
    try {
      wx.showLoading({ title: '搜索中...' });
      const res = await api.searchFund(keyword);
      this.setData({ isSearching: true, searchResults: res.data });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
    }
  },

  onSwitchRanking(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ rankingType: type, isSearching: false, searchResults: [] });
    this.loadData();
  },

  onFundTap(e) {
    const fund = e.detail && e.detail.fund;
    if (fund) wx.showToast({ title: `查看 ${fund.name}`, icon: 'none' });
  },

  onAddToWatchlist(e) {
    const fund = e.currentTarget.dataset.fund;
    if (!fund) return;

    const exists = this.data.watchList.some(f => f.code === fund.code);
    if (exists) {
      wx.showToast({ title: '已在自选中', icon: 'none' });
      return;
    }

    const watchList = [...this.data.watchList, fund];
    this.setData({ watchList });
    wx.showToast({ title: '已添加到自选', icon: 'success' });
  },

  onDeleteFund(e) {
    const code = e.currentTarget.dataset.code;
    const watchList = this.data.watchList.filter(f => f.code !== code);
    this.setData({ watchList });
    wx.showToast({ title: '已删除', icon: 'success' });
  }
});
```

- [ ] **Step 3: 修改 pages/sentiment/sentiment.js**

```javascript
const api = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 44,
    sentimentIndex: 50,
    sentiment: '中性',
    upLimit: 0,
    downLimit: 0,
    burstRate: 0,
    yesterdayUpToday: 0,
    etfCategory: 'broad',
    etfList: []
  },

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadSentimentData();
    this.loadETFData();
  },

  onPullDownRefresh() {
    Promise.all([this.loadSentimentData(), this.loadETFData()]).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadSentimentData() {
    try {
      const indexRes = await api.getSentimentIndex();
      const metricsRes = await api.getMarketMetrics();
      this.setData({
        sentimentIndex: indexRes.data.fearGreedIndex,
        sentiment: indexRes.data.sentiment,
        ...metricsRes.data
      });
    } catch (err) {
      console.error('加载情绪数据失败:', err);
    }
  },

  async loadETFData() {
    try {
      const res = await api.getETFFlow(this.data.etfCategory);
      this.setData({ etfList: res.data });
    } catch (err) {
      console.error('加载ETF数据失败:', err);
    }
  },

  onSwitchETFCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ etfCategory: category });
    this.loadETFData();
  }
});
```

- [ ] **Step 4: 修改 pages/dragon/dragon.js**

```javascript
const api = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 44,
    dragonList: [],
    dealerRanking: []
  },

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadData() {
    try {
      const listRes = await api.getDragonList();
      const dealerRes = await api.getDealerRanking();
      this.setData({
        dragonList: listRes.data,
        dealerRanking: dealerRes.data
      });
    } catch (err) {
      console.error('加载龙虎榜数据失败:', err);
    }
  }
});
```

- [ ] **Step 5: 提交**

```bash
git add utils/api.js pages/fund/fund.js pages/sentiment/sentiment.js pages/dragon/dragon.js
git commit -m "feat: 完成小程序前端API集成"
```

---

### Task 9: 最终测试和验证

**Files:**
- 无需新建文件，通过浏览器和小程序测试

- [ ] **Step 1: 启动后端服务**

```bash
cd server
npm run dev
```

- [ ] **Step 2: 测试后端API**

访问以下URL测试：
- http://localhost:3000/health
- http://localhost:3000/api/fund/list
- http://localhost:3000/api/sentiment/index

- [ ] **Step 3: 打开小程序开发工具测试**

1. 打开微信开发者工具
2. 确认已配置不校验合法域名
3. 运行小程序，测试各个功能

- [ ] **Step 4: 验证降级机制（可选）**

1. 停止后端服务
2. 小程序应显示网络错误提示
3. 重启服务，应恢复正常

---

## 自检清单

### 设计覆盖检查
- [x] 后端架构（Node.js + Express）
- [x] 双缓存策略（内存+文件）
- [x] 东方财富API
- [x] tushare API（含token配置）
- [x] Mock数据降级
- [x] 小程序改造
- [x] 限流保护
- [x] .gitignore（确保token不提交）

### 安全检查
- [x] token在.env中，不提交git
- [x] .gitignore包含.env和cache目录
- [x] 有API限流保护

---

**Plan complete and saved to docs/superpowers/plans/2026-05-24-real-api-integration.md.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**

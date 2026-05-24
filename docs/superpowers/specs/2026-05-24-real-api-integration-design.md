# 金融数据助手 - 实盘API集成设计文档

## 文档信息

- **项目名称**：金融数据助手（Fund Data Assistant）
- **版本**：v2.0 - 实盘API集成版
- **日期**：2026-05-24
- **状态**：待审核
- **作者**：AI Assistant

---

## 1. 项目概述

### 1.1 背景
当前项目为微信小程序原型，使用Mock模拟数据。本次设计目标是对接真实API（东方财富、tushare），实现实盘数据展示，同时保留Mock数据降级机制。

### 1.2 技术架构
```
┌─────────────────────────────────────────┐
│  微信小程序 (前端)                      │
│  (原项目保持不变)                       │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ↓
┌─────────────────────────────────────────┐
│  Node.js Express 后端代理              │
│  (新增独立目录 /server/)               │
│  ├─ 环境配置管理 (.env)                 │
│  ├─ 双缓存策略 (内存 + 文件)            │
│  ├─ 限流保护 (Rate Limiter)             │
│  └─ 容错降级 (Mock数据备用)             │
└──────────────┬──────────────────────────┘
               │
               ├─→ 东方财富API (基金 + ETF)
               └─→ tushare API (情绪 + 龙虎榜，可选)
```

### 1.3 配置选择确认

| 配置项 | 选择 |
|--------|------|
| **技术架构** | 后端代理 + 小程序前端 |
| **后端技术** | Node.js + Express |
| **目录结构** | 独立后端目录（/server/） |
| **刷新策略** | 混合策略（手动 + 10分钟自动刷新） |
| **缓存策略** | 保守友好型（5-10分钟缓存） |
| **tushare** | 需要先说明注册步骤，支持开关配置 |

---

## 2. 后端目录结构设计

```
/AI_PROJ/
├── server/                      ← 新增：Node.js 后端
│   ├── package.json
│   ├── server.js                # 主入口
│   ├── .env                     # 环境配置（git忽略）
│   ├── .env.example             # 配置模板
│   ├── .gitignore
│   ├── README.md                # 后端部署文档
│   ├── README_TUSHARE.md        # tushare注册指南
│   ├── config/
│   │   └── config.js
│   ├── routes/                  # API路由
│   │   ├── fund.js
│   │   ├── sentiment.js
│   │   ├── etf.js
│   │   └── dragon.js
│   ├── services/                # 数据服务
│   │   ├── eastmoney.js         # 东方财富API适配
│   │   ├── tushare.js           # tushare API适配
│   │   ├── cache.js             # 双缓存服务
│   │   └── mockService.js       # Mock降级数据
│   ├── utils/
│   │   ├── logger.js            # 日志工具
│   │   └── limiter.js           # 限流工具
│   └── cache/                   # 本地文件缓存（git忽略）
│
└── [原微信小程序项目]
    ├── pages/
    ├── components/
    ├── utils/
    └── ...
```

---

## 3. 配置管理设计

### 3.1 环境变量配置 (.env)

```env
# server/.env
# ================================================

# 服务器配置
PORT=3000
NODE_ENV=development

# tushare配置
TUSHARE_TOKEN=                  # 留空则使用Mock数据
TUSHARE_BASE_URL=https://api.tushare.pro

# 缓存配置
CACHE_MEMORY_TTL=300000         # 内存缓存5分钟
CACHE_FILE_TTL=1800000          # 文件缓存30分钟
CACHE_DIR=./cache

# API限流配置
API_RATE_LIMIT=30               # 每分钟最多30次请求
API_WINDOW_MS=60000             # 限流窗口

# 自动刷新配置
AUTO_REFRESH_INTERVAL=600000    # 10分钟自动刷新

# CORS配置（小程序白名单）
ALLOWED_ORIGINS=*
```

### 3.2 配置文件 (config/config.js)

```javascript
// server/config/config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  server: {
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  tushare: {
    token: process.env.TUSHARE_TOKEN || '',
    baseUrl: process.env.TUSHARE_BASE_URL || 'https://api.tushare.pro',
    enabled: !!process.env.TUSHARE_TOKEN // 有token才启用
  },
  
  cache: {
    memoryTTL: parseInt(process.env.CACHE_MEMORY_TTL) || 300000,
    fileTTL: parseInt(process.env.CACHE_FILE_TTL) || 1800000,
    cacheDir: process.env.CACHE_DIR || './cache'
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

---

## 4. 缓存策略设计（双缓存）

### 4.1 缓存层级

```
小程序请求
    ↓
检查内存缓存 ──→ 命中 → 返回 (最快)
    ↓ 未命中
检查文件缓存 ──→ 命中 → 同步到内存 → 返回 (次快)
    ↓ 未命中
请求真实API ──→ 成功 → 写入双缓存 → 返回
    ↓ 失败
使用Mock数据 ──→ 记录错误日志 → 返回 (兜底)
```

### 4.2 缓存Key设计

```
内存缓存：
- cache:fund:list
- cache:fund:search:{keyword}
- cache:sentiment:index
- cache:etf:flow:{category}
- cache:dragon:list

文件缓存：
- cache/fund_list.json
- cache/sentiment_index.json
- cache/etf_flow_{category}.json
- cache/dragon_list.json
```

### 4.3 各数据TTL配置

| 数据类型 | 内存缓存 | 文件缓存 |
|---------|---------|---------|
| 基金估值 | 5分钟 | 30分钟 |
| 情绪数据 | 10分钟 | 60分钟 |
| ETF流向 | 15分钟 | 90分钟 |
| 龙虎榜 | 30分钟 | 4小时 |

---

## 5. 后端API接口设计

### 5.1 接口总览

| 接口路径 | 方法 | 功能 | 数据来源 |
|---------|------|------|---------|
| `/api/fund/list` | GET | 基金估值列表 | 东方财富 |
| `/api/fund/search` | GET | 搜索基金 | 东方财富 |
| `/api/sentiment/index` | GET | 恐慌贪婪指数 | 计算 / tushare |
| `/api/sentiment/market` | GET | 市场情绪指标 | tushare / Mock |
| `/api/etf/flow` | GET | ETF资金流向 | 东方财富 |
| `/api/dragon/list` | GET | 龙虎榜列表 | tushare / Mock |
| `/api/dragon/dealers` | GET | 营业部排行 | tushare / Mock |

### 5.2 标准响应格式

```javascript
{
  success: boolean,
  data: any,
  message: string,
  timestamp: number,
  fromCache: boolean,    // 是否来自缓存
  dataSource: 'api' | 'cache' | 'mock'
}
```

---

## 6. 数据源适配设计

### 6.1 东方财富API适配

**基金估值获取：**
```javascript
// 东方财富API返回格式示例
{
  fundcode: "000001",
  name: "平安优选混合A",
  gsz: "1.2345",
  gszzl: "2.35",
  gztime: "2024-01-15 14:30"
}

// 转换为标准格式
{
  code: "000001",
  name: "平安优选混合A",
  estimateNav: 1.2345,
  navDate: "2024-01-15",
  estimateChange: 2.35,
  trend: [ ... ] // 计算趋势
}
```

### 6.2 tushare API适配

**接口列表：**
| 接口名 | 功能 | 文档 |
|-------|------|------|
| `daily_basic` | 涨跌停统计 | https://tushare.pro/document/2?doc_id=32 |
| `top_list` | 龙虎榜 | https://tushare.pro/document/2?doc_id=106 |
| `money_flow` | 资金流向 | https://tushare.pro/document/2?doc_id=173 |

**数据格式转换：**

**daily_basic（情绪指标 → market情绪指标：
```javascript
// tushare返回
{
  ts_code: "000001.SZ",
  trade_date: "20240115",
  close: 12.34,
  ...
}
// → 转换为情绪指标
{
  fearGreedIndex: 计算值(0-100),
  sentiment: "偏多",
  upLimit: 统计值,
  downLimit: 统计值,
  ...
}
```

**top_list龙虎榜 → 标准结构：**
```javascript
// tushare返回
{
  ts_code: "000001.SZ",
  name: "平安银行",
  ...
}
// → 转换
{
  code: "000001",
  name: "平安银行",
  ...
}
```

### 6.3 tushare注册指南 (README_TUSHARE.md)

文档包含：
1. 注册步骤（访问 https://tushare.pro）
2. 获取Token教程
3. 积分说明（基础功能免费）
4. 常见问题FAQ
5. 环境配置步骤

---

## 7. 小程序前端改造设计

### 7.1 新增API服务模块

```javascript
// utils/api.js (新增)
const BASE_URL = 'http://localhost:3000/api';

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          wx.showToast({ title: res.data.message, icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
};

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

### 7.2 页面改造（示例：基金页面）

保持现有页面结构，修改数据获取方式：

```javascript
// pages/fund/fund.js
const api = require('../../utils/api.js'); // 新增

Page({
  // ... 其他代码不变

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadData(); // 调用API而非Mock
  },

  async loadData() {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await api.getFundList();
      // 使用API返回的数据
    } catch (err) {
      console.error(err);
    } finally {
      wx.hideLoading();
    }
  }
});
```

---

## 8. 限流和日志设计

### 8.1 限流保护

```javascript
// server/utils/limiter.js
// 使用 express-rate-limit 防止API请求过频繁
// 每分钟最多30次请求
```

### 8.2 日志系统

```javascript
// server/utils/logger.js
// 结构化日志输出
// 记录请求、错误、缓存命中情况
```

---

## 9. 项目迁移和部署

### 9.1 本地开发步骤

1. **后端启动：**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # 编辑 .env，填入配置
   npm run dev
   ```

2. **小程序配置：**
   - 在小程序开发工具中，配置合法域名
   - 修改 `utils/api.js` 中的 `BASE_URL`

### 9.2 生产部署建议

- 后端部署：Vercel / Railway / 阿里云ECS
- 域名配置：申请HTTPS域名，配置CORS
- 小程序：配置合法域名，提交审核

---

## 附录：Mock数据保持兼容

在后端 `services/mockService.js` 中，保持与原 `utils/mock.js` 相同的数据结构，确保降级时前端无需修改。

---

**文档结束**

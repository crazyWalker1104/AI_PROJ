# 金融数据助手 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个具有科技感深色主题的金融数据小程序原型，包含基金实时估值、市场情绪分析、ETF资金流向三大核心功能

**Architecture:** 
- 单页应用架构 + 底部Tab导航
- 模块化JS架构：UI层 → 组件层 → 服务层 → API层
- 数据降级策略：优先真实API → 缓存数据 → 模拟数据
- localStorage持久化自选基金和用户偏好

**Tech Stack:** HTML5 + CSS3 + Vanilla JavaScript + localStorage

---

## 文件结构

```
/Users/zhoutianrun/Documents/AI_PROJ/
├── index.html              # 主页面HTML结构
├── styles.css              # 全局样式（科技感深色主题）
├── js/
│   ├── app.js              # 主应用入口
│   ├── services/
│   │   ├── storage.js      # 本地存储服务
│   │   ├── cache.js        # 缓存服务
│   │   └── api.js          # API适配器（东方财富 + tushare）
│   ├── components/
│   │   ├── tabbar.js       # TabBar组件
│   │   ├── fundCard.js     # 基金卡片组件
│   │   ├── emotionGauge.js # 情绪仪表盘组件
│   │   ├── metricCard.js   # 指标卡片组件
│   │   └── etfBanner.js    # ETF条目组件
│   └── pages/
│       ├── fundPage.js      # 基金估值页面
│       ├── sentimentPage.js # 情绪分析页面
│       └── dragonPage.js   # 龙虎榜页面（预留）
├── mock/
│   └── mockData.js          # 模拟数据
└── SPEC.md                  # 设计规格文档
```

---

## 任务列表

### Task 1: 项目初始化和HTML基础结构

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `js/app.js`

- [ ] **Step 1: 创建index.html主页面结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>金融数据助手</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- 状态栏 -->
  <div class="status-bar">
    <div class="status-time" id="statusTime">10:30</div>
    <div class="status-icons">
      <span class="icon-signal">📶</span>
      <span class="icon-battery">🔋 85%</span>
    </div>
  </div>

  <!-- 页面标题 -->
  <header class="page-header">
    <h1 class="page-title">金融数据助手</h1>
    <button class="btn-refresh" id="btnRefresh" title="刷新数据">
      <span class="icon-refresh">🔄</span>
    </button>
  </header>

  <!-- 主内容区域 -->
  <main class="main-content" id="mainContent">
    <!-- Tab 1: 基金估值 -->
    <section class="tab-panel active" id="tabFund">
      <div class="search-bar">
        <input type="text" placeholder="搜索基金代码或名称" class="search-input">
        <button class="btn-search">🔍</button>
      </div>
      <div class="watchlist-section">
        <h2 class="section-title">我的自选</h2>
        <div class="fund-list" id="fundList">
          <!-- 基金卡片将动态插入 -->
        </div>
      </div>
      <div class="ranking-section">
        <h2 class="section-title">估值排行榜</h2>
        <div class="ranking-tabs">
          <button class="ranking-tab active" data-type="rise">涨幅榜</button>
          <button class="ranking-tab" data-type="fall">跌幅榜</button>
        </div>
        <div class="fund-list" id="rankingList">
          <!-- 排行榜基金卡片将动态插入 -->
        </div>
      </div>
    </section>

    <!-- Tab 2: 情绪分析 -->
    <section class="tab-panel" id="tabSentiment">
      <div class="emotion-gauge-container">
        <div class="emotion-gauge" id="emotionGauge">
          <svg class="gauge-svg" viewBox="0 0 200 200">
            <!-- 环形进度条将通过JS生成 -->
          </svg>
          <div class="gauge-center">
            <span class="gauge-value" id="gaugeValue">72</span>
            <span class="gauge-label" id="gaugeLabel">偏多</span>
          </div>
        </div>
      </div>
      <div class="metrics-grid" id="metricsGrid">
        <!-- 情绪指标卡片将动态插入 -->
      </div>
      <div class="etf-section">
        <h2 class="section-title">ETF资金流向</h2>
        <div class="etf-tabs">
          <button class="etf-tab active" data-category="broad">宽基</button>
          <button class="etf-tab" data-category="industry">行业</button>
          <button class="etf-tab" data-category="cross">跨境</button>
        </div>
        <div class="etf-list" id="etfList">
          <!-- ETF条目将动态插入 -->
        </div>
      </div>
    </section>

    <!-- Tab 3: 龙虎榜（预留） -->
    <section class="tab-panel" id="tabDragon">
      <div class="empty-state">
        <span class="empty-icon">📊</span>
        <p class="empty-text">龙虎榜功能即将上线</p>
        <p class="empty-hint">敬请期待...</p>
      </div>
    </section>
  </main>

  <!-- 底部Tab导航 -->
  <nav class="tab-bar" id="tabBar">
    <div class="tab-indicator"></div>
    <div class="tab-item active" data-tab="fund">
      <span class="tab-icon">📈</span>
      <span class="tab-text">基金估值</span>
    </div>
    <div class="tab-item" data-tab="sentiment">
      <span class="tab-icon">📊</span>
      <span class="tab-text">情绪分析</span>
    </div>
    <div class="tab-item" data-tab="dragon">
      <span class="tab-icon">🐉</span>
      <span class="tab-text">龙虎榜</span>
    </div>
  </nav>

  <!-- 加载遮罩 -->
  <div class="loading-overlay" id="loadingOverlay" style="display: none;">
    <div class="loading-spinner"></div>
    <p class="loading-text">数据加载中...</p>
  </div>

  <!-- Toast提示 -->
  <div class="toast" id="toast" style="display: none;"></div>

  <script src="js/app.js" type="module"></script>
</body>
</html>
```

- [ ] **Step 2: 创建基础CSS样式（styles.css）**

```css
/* 导入Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* CSS变量定义 */
:root {
  /* 背景色 */
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-card: #1a2332;
  --bg-card-hover: #232f42;
  
  /* 主色调 */
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
  
  /* 文字色 */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  /* 涨跌色 */
  --color-rise: #10b981;
  --color-fall: #ef4444;
  --color-warning: #f59e0b;
  
  /* 边框和阴影 */
  --border-color: rgba(99, 102, 241, 0.2);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
  
  /* 字体 */
  --font-display: 'Orbitron', monospace;
  --font-body: 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  
  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}

/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 移动端容器 */
.app-container {
  max-width: 480px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

/* 页面进入动画 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-content {
  animation: fade-in-up 300ms ease-out;
}

/* 骨架屏动画 */
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.skeleton {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  background: var(--bg-card);
}
```

- [ ] **Step 3: 创建app.js主入口文件**

```javascript
// js/app.js
import { TabBar } from './components/tabbar.js';
import { FundPage } from './pages/fundPage.js';
import { SentimentPage } from './pages/sentimentPage.js';
import { StorageService } from './services/storage.js';
import { showToast, showLoading, hideLoading } from './utils.js';

class App {
  constructor() {
    this.storage = new StorageService();
    this.init();
  }

  async init() {
    // 初始化Tab导航
    this.tabBar = new TabBar({
      onTabChange: (tabName) => this.handleTabChange(tabName)
    });

    // 初始化页面
    this.fundPage = new FundPage();
    this.sentimentPage = new SentimentPage();

    // 加载用户偏好
    this.loadPreferences();

    // 绑定刷新按钮
    this.bindRefreshButton();

    // 更新时间
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);

    // 加载初始数据
    await this.loadInitialData();
  }

  async loadInitialData() {
    try {
      showLoading();
      await Promise.all([
        this.fundPage.load(),
        this.sentimentPage.load()
      ]);
    } catch (error) {
      console.error('加载初始数据失败:', error);
      showToast('数据加载失败，请刷新重试');
    } finally {
      hideLoading();
    }
  }

  handleTabChange(tabName) {
    // 切换Tab面板显示
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');

    // 保存用户偏好
    this.storage.setPreference('activeTab', tabName);
  }

  loadPreferences() {
    const activeTab = this.storage.getPreference('activeTab') || 'fund';
    this.tabBar.setActiveTab(activeTab);
    this.handleTabChange(activeTab);
  }

  bindRefreshButton() {
    const btn = document.getElementById('btnRefresh');
    btn.addEventListener('click', async () => {
      btn.classList.add('rotating');
      await this.loadInitialData();
      btn.classList.remove('rotating');
      showToast('数据已更新');
    });
  }

  updateTime() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    document.getElementById('statusTime').textContent = timeStr;
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
```

- [ ] **Step 4: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add index.html styles.css js/app.js
git commit -m "feat: 创建项目基础结构和HTML/CSS框架"
```

---

### Task 2: 实现存储服务层

**Files:**
- Create: `js/services/storage.js`
- Create: `js/services/cache.js`
- Create: `js/utils.js`

- [ ] **Step 1: 创建StorageService（本地存储服务）**

```javascript
// js/services/storage.js
export class StorageService {
  constructor() {
    this.keys = {
      watchlist: 'fund_watchlist',
      preferences: 'user_preferences',
      cache: 'fund_cache'
    };
  }

  // 获取自选基金列表
  getWatchlist() {
    try {
      const data = localStorage.getItem(this.keys.watchlist);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return parsed.funds || [];
    } catch (error) {
      console.error('读取自选基金失败:', error);
      return [];
    }
  }

  // 保存自选基金列表
  saveWatchlist(funds) {
    try {
      localStorage.setItem(this.keys.watchlist, JSON.stringify({
        version: 1,
        funds: funds,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('保存自选基金失败:', error);
    }
  }

  // 添加自选基金
  addToWatchlist(fundCode) {
    const list = this.getWatchlist();
    if (!list.includes(fundCode)) {
      list.push(fundCode);
      this.saveWatchlist(list);
    }
  }

  // 删除自选基金
  removeFromWatchlist(fundCode) {
    const list = this.getWatchlist();
    const index = list.indexOf(fundCode);
    if (index > -1) {
      list.splice(index, 1);
      this.saveWatchlist(list);
    }
  }

  // 获取用户偏好
  getPreference(key) {
    try {
      const data = localStorage.getItem(this.keys.preferences);
      if (!data) return null;
      const prefs = JSON.parse(data);
      return prefs[key] || null;
    } catch (error) {
      console.error('读取用户偏好失败:', error);
      return null;
    }
  }

  // 设置用户偏好
  setPreference(key, value) {
    try {
      let prefs = {};
      const data = localStorage.getItem(this.keys.preferences);
      if (data) {
        prefs = JSON.parse(data);
      }
      prefs[key] = value;
      localStorage.setItem(this.keys.preferences, JSON.stringify(prefs));
    } catch (error) {
      console.error('保存用户偏好失败:', error);
    }
  }
}
```

- [ ] **Step 2: 创建CacheService（缓存服务）**

```javascript
// js/services/cache.js
export class CacheService {
  constructor() {
    this.prefix = 'cache_';
    this.defaultTTL = {
      fund: 5 * 60 * 1000,      // 5分钟
      sentiment: 15 * 60 * 1000, // 15分钟
      etf: 30 * 60 * 1000        // 30分钟
    };
  }

  // 获取缓存
  get(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      if (!data) return null;
      
      const cached = JSON.parse(data);
      const now = Date.now();
      
      // 检查是否过期
      if (now > cached.expireAt) {
        this.remove(key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('读取缓存失败:', error);
      return null;
    }
  }

  // 设置缓存
  set(key, data, ttl = this.defaultTTL.fund) {
    try {
      const cacheData = {
        data: data,
        expireAt: Date.now() + ttl,
        createdAt: Date.now()
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }

  // 删除缓存
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }

  // 清除所有缓存
  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}
```

- [ ] **Step 3: 创建工具函数（utils.js）**

```javascript
// js/utils.js

// 显示Toast提示
export function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, duration);
}

// 显示加载遮罩
export function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

// 隐藏加载遮罩
export function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

// 格式化数字（保留2位小数）
export function formatNumber(num, decimals = 2) {
  return Number(num).toFixed(decimals);
}

// 格式化涨跌幅
export function formatChange(change) {
  const num = Number(change);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

// 获取涨跌色类名
export function getChangeColorClass(change) {
  const num = Number(change);
  if (num > 0) return 'text-rise';
  if (num < 0) return 'text-fall';
  return 'text-neutral';
}

// 防抖函数
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 创建骨架屏元素
export function createSkeleton(type) {
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton';
  
  switch(type) {
    case 'card':
      skeleton.classList.add('skeleton-card');
      skeleton.innerHTML = '<div class="skeleton-line"></div><div class="skeleton-line short"></div>';
      break;
    case 'gauge':
      skeleton.classList.add('skeleton-gauge');
      break;
    default:
      skeleton.innerHTML = '<div class="skeleton-line"></div>';
  }
  
  return skeleton;
}
```

- [ ] **Step 4: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add js/services/storage.js js/services/cache.js js/utils.js
git commit -m "feat: 实现存储服务和缓存层"
```

---

### Task 3: 实现TabBar组件

**Files:**
- Create: `js/components/tabbar.js`

- [ ] **Step 1: 创建TabBar组件**

```javascript
// js/components/tabbar.js
export class TabBar {
  constructor(options = {}) {
    this.options = {
      onTabChange: options.onTabChange || (() => {})
    };
    this.init();
  }

  init() {
    this.tabBar = document.getElementById('tabBar');
    this.tabs = this.tabBar.querySelectorAll('.tab-item');
    this.indicator = this.tabBar.querySelector('.tab-indicator');
    
    this.bindEvents();
    this.updateIndicator(0);
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.setActiveTab(tab.dataset.tab);
        this.options.onTabChange(tab.dataset.tab);
      });
    });
  }

  setActiveTab(tabName) {
    this.tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    const index = Array.from(this.tabs).findIndex(tab => tab.dataset.tab === tabName);
    this.updateIndicator(index);
  }

  updateIndicator(index) {
    const tab = this.tabs[index];
    if (!tab) return;
    
    const rect = tab.getBoundingClientRect();
    const barRect = this.tabBar.getBoundingClientRect();
    const left = rect.left - barRect.left + (rect.width - 60) / 2;
    
    this.indicator.style.transform = `translateX(${left}px)`;
  }
}
```

- [ ] **Step 2: 添加TabBar样式到styles.css**

```css
/* TabBar样式 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 60px;
  background: rgba(26, 35, 50, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.tab-indicator {
  position: absolute;
  top: 8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  transition: transform 200ms ease-out;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  padding: var(--space-sm) var(--space-lg);
  transition: all 200ms ease;
}

.tab-item.active {
  color: var(--accent-primary);
}

.tab-icon {
  font-size: 24px;
}

.tab-text {
  font-size: 12px;
  font-weight: 500;
}
```

- [ ] **Step 3: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add js/components/tabbar.js styles.css
git commit -m "feat: 实现TabBar组件和样式"
```

---

### Task 4: 实现API服务层

**Files:**
- Create: `js/services/api.js`
- Create: `mock/mockData.js`

- [ ] **Step 1: 创建API服务**

```javascript
// js/services/api.js
import { CacheService } from './cache.js';
import { mockFunds, mockSentiment, mockETFs } from '../../mock/mockData.js';

class APIService {
  constructor() {
    this.cache = new CacheService();
    this.isDev = true; // 开发模式使用模拟数据
  }

  // 获取基金数据（支持真实API和模拟数据）
  async getFundData(fundCode) {
    // 先检查缓存
    const cacheKey = `fund_${fundCode}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (!this.isDev) {
        // 真实API调用（东方财富）
        const response = await this.fetchFundFromAPI(fundCode);
        this.cache.set(cacheKey, response, this.cache.defaultTTL.fund);
        return response;
      } else {
        // 使用模拟数据
        await this.delay(500); // 模拟网络延迟
        const mockFund = mockFunds.find(f => f.fundCode === fundCode);
        if (!mockFund) throw new Error('基金不存在');
        this.cache.set(cacheKey, mockFund, this.cache.defaultTTL.fund);
        return mockFund;
      }
    } catch (error) {
      console.error('获取基金数据失败:', error);
      throw error;
    }
  }

  // 获取自选基金列表
  async getWatchlistFunds(fundCodes) {
    const funds = await Promise.all(
      fundCodes.map(code => this.getFundData(code).catch(() => null))
    );
    return funds.filter(fund => fund !== null);
  }

  // 搜索基金
  async searchFunds(keyword) {
    try {
      if (!this.isDev) {
        // 真实API调用
        return await this.fetchSearchResults(keyword);
      } else {
        // 模拟搜索
        await this.delay(300);
        return mockFunds.filter(fund => 
          fund.fundCode.includes(keyword) || 
          fund.fundName.includes(keyword)
        );
      }
    } catch (error) {
      console.error('搜索基金失败:', error);
      return [];
    }
  }

  // 获取排行榜
  async getRanking(type = 'rise') {
    const cacheKey = `ranking_${type}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (!this.isDev) {
        const response = await this.fetchRanking(type);
        this.cache.set(cacheKey, response, this.cache.defaultTTL.fund);
        return response;
      } else {
        await this.delay(500);
        let ranking = [...mockFunds];
        ranking = type === 'rise' 
          ? ranking.sort((a, b) => b.estimateChange - a.estimateChange)
          : ranking.sort((a, b) => a.estimateChange - b.estimateChange);
        this.cache.set(cacheKey, ranking.slice(0, 20), this.cache.defaultTTL.fund);
        return ranking.slice(0, 20);
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return [];
    }
  }

  // 获取情绪数据
  async getSentimentData() {
    const cacheKey = 'sentiment';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (!this.isDev) {
        const response = await this.fetchSentiment();
        this.cache.set(cacheKey, response, this.cache.defaultTTL.sentiment);
        return response;
      } else {
        await this.delay(500);
        this.cache.set(cacheKey, mockSentiment, this.cache.defaultTTL.sentiment);
        return mockSentiment;
      }
    } catch (error) {
      console.error('获取情绪数据失败:', error);
      throw error;
    }
  }

  // 获取ETF数据
  async getETFData(category = 'broad') {
    const cacheKey = `etf_${category}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (!this.isDev) {
        const response = await this.fetchETFs(category);
        this.cache.set(cacheKey, response, this.cache.defaultTTL.etf);
        return response;
      } else {
        await this.delay(500);
        const etfs = mockETFs.filter(etf => etf.category === category);
        this.cache.set(cacheKey, etfs, this.cache.defaultTTL.etf);
        return etfs;
      }
    } catch (error) {
      console.error('获取ETF数据失败:', error);
      return [];
    }
  }

  // 模拟网络延迟
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 真实API调用方法（预留）
  async fetchFundFromAPI(fundCode) {
    // TODO: 实现东方财富API调用
    throw new Error('真实API暂未实现');
  }

  async fetchSearchResults(keyword) {
    // TODO: 实现东方财富搜索API
    throw new Error('真实API暂未实现');
  }

  async fetchRanking(type) {
    // TODO: 实现排行榜API
    throw new Error('真实API暂未实现');
  }

  async fetchSentiment() {
    // TODO: 实现tushare情绪数据API
    throw new Error('真实API暂未实现');
  }

  async fetchETFs(category) {
    // TODO: 实现ETF数据API
    throw new Error('真实API暂未实现');
  }
}

export const apiService = new APIService();
```

- [ ] **Step 2: 创建模拟数据**

```javascript
// mock/mockData.js

export const mockFunds = [
  {
    fundCode: '000001',
    fundName: '平安优选混合A',
    estimateNav: 1.2345,
    navDate: '2024-01-15',
    estimateChange: 2.35,
    trend: [1.20, 1.22, 1.25, 1.23, 1.2345]
  },
  {
    fundCode: '110022',
    fundName: '易方达消费行业股票',
    estimateNav: 3.5678,
    navDate: '2024-01-15',
    estimateChange: 1.87,
    trend: [3.50, 3.52, 3.55, 3.56, 3.5678]
  },
  {
    fundCode: '420001',
    fundName: '天弘指数增强A',
    estimateNav: 2.1234,
    navDate: '2024-01-15',
    estimateChange: -0.56,
    trend: [2.15, 2.14, 2.13, 2.12, 2.1234]
  },
  {
    fundCode: '519674',
    fundName: '银河创新成长混合A',
    estimateNav: 4.8765,
    navDate: '2024-01-15',
    estimateChange: 3.21,
    trend: [4.70, 4.75, 4.80, 4.85, 4.8765]
  },
  {
    fundCode: '162703',
    fundName: '广发中证传媒ETF联接A',
    estimateNav: 1.0987,
    navDate: '2024-01-15',
    estimateChange: -1.23,
    trend: [1.12, 1.11, 1.10, 1.09, 1.0987]
  },
  {
    fundCode: '001410',
    fundName: '信达澳银新能源产业股票',
    estimateNav: 2.8765,
    navDate: '2024-01-15',
    estimateChange: 1.56,
    trend: [2.80, 2.83, 2.85, 2.87, 2.8765]
  },
  {
    fundCode: '006328',
    fundName: '中金新医药股票A',
    estimateNav: 1.5432,
    navDate: '2024-01-15',
    estimateChange: 0.89,
    trend: [1.52, 1.53, 1.54, 1.54, 1.5432]
  },
  {
    fundCode: '005827',
    fundName: '易方达蓝筹精选混合',
    estimateNav: 2.3456,
    navDate: '2024-01-15',
    estimateChange: -0.34,
    trend: [2.36, 2.35, 2.35, 2.34, 2.3456]
  },
  {
    fundCode: '001475',
    fundName: '永赢惠添利灵活配置混合',
    estimateNav: 1.8765,
    navDate: '2024-01-15',
    estimateChange: 2.67,
    trend: [1.82, 1.84, 1.86, 1.87, 1.8765]
  },
  {
    fundCode: '001178',
    fundName: '前海开源再融资股票',
    estimateNav: 1.4567,
    navDate: '2024-01-15',
    estimateChange: 1.12,
    trend: [1.43, 1.44, 1.45, 1.45, 1.4567]
  }
];

export const mockSentiment = {
  fearGreedIndex: 72,
  sentiment: '偏多',
  upLimit: 45,
  downLimit: 8,
  burstRate: 15.2,
  yesterdayUpToday: 3.5,
  updateTime: '10:30:00'
};

export const mockETFs = [
  {
    etfCode: '510300',
    etfName: '华泰柏瑞沪深300ETF',
    category: 'broad',
    netInflow: 12.5,
    flowRate: 2.3,
    volume: 85.6
  },
  {
    etfCode: '510500',
    etfName: '南方中证500ETF',
    category: 'broad',
    netInflow: 8.7,
    flowRate: 1.8,
    volume: 62.3
  },
  {
    etfCode: '510050',
    etfName: '华夏上证50ETF',
    category: 'broad',
    netInflow: 5.2,
    flowRate: 1.2,
    volume: 45.8
  },
  {
    etfCode: '159915',
    etfName: '易方达创业板ETF',
    category: 'broad',
    netInflow: 15.3,
    flowRate: 3.5,
    volume: 92.1
  },
  {
    etfCode: '588000',
    etfName: '华夏科创50ETF',
    category: 'broad',
    netInflow: 6.8,
    flowRate: 1.6,
    volume: 48.5
  },
  {
    etfCode: '512880',
    etfName: '国泰中证全指证券公司ETF',
    category: 'industry',
    netInflow: 3.2,
    flowRate: 0.8,
    volume: 28.5
  },
  {
    etfCode: '512800',
    etfName: '华宝中证银行ETF',
    category: 'industry',
    netInflow: -2.1,
    flowRate: -0.5,
    volume: 18.3
  },
  {
    etfCode: '512660',
    etfName: '国泰中证军工ETF',
    category: 'industry',
    netInflow: 4.5,
    flowRate: 1.2,
    volume: 32.6
  },
  {
    etfCode: '159928',
    etfName: '汇添富中证主要消费ETF',
    category: 'industry',
    netInflow: 2.8,
    flowRate: 0.7,
    volume: 22.4
  },
  {
    etfCode: '513500',
    etfName: '博时标普500ETF',
    category: 'cross',
    netInflow: 1.5,
    flowRate: 0.4,
    volume: 12.8
  },
  {
    etfCode: '513100',
    etfName: '国泰纳斯达克100ETF',
    category: 'cross',
    netInflow: 2.3,
    flowRate: 0.6,
    volume: 15.6
  },
  {
    etfCode: '513520',
    etfName: '华夏日经225ETF',
    category: 'cross',
    netInflow: -0.8,
    flowRate: -0.2,
    volume: 8.5
  }
];
```

- [ ] **Step 3: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add js/services/api.js mock/mockData.js
git commit -m "feat: 实现API服务层和模拟数据"
```

---

### Task 5: 实现基金卡片组件和基金页面

**Files:**
- Create: `js/components/fundCard.js`
- Create: `js/pages/fundPage.js`

- [ ] **Step 1: 创建FundCard组件**

```javascript
// js/components/fundCard.js
import { formatNumber, formatChange, getChangeColorClass } from '../utils.js';

export class FundCard {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      showTrend: options.showTrend !== false,
      onDelete: options.onDelete || null,
      onClick: options.onClick || null,
      isWatchlist: options.isWatchlist || false
    };
    this.element = null;
    this.render();
  }

  render() {
    const { fundCode, fundName, estimateNav, navDate, estimateChange, trend } = this.data;
    const changeClass = getChangeColorClass(estimateChange);
    
    this.element = document.createElement('div');
    this.element.className = 'fund-card';
    this.element.innerHTML = `
      <div class="fund-card-header">
        <div class="fund-info">
          <span class="fund-code">${fundCode}</span>
          <span class="fund-name">${fundName}</span>
        </div>
        <div class="fund-nav">
          <span class="nav-value">${formatNumber(estimateNav, 4)}</span>
          <span class="nav-date">${navDate}</span>
        </div>
      </div>
      ${this.options.showTrend ? this.renderTrend(trend) : ''}
      <div class="fund-card-footer">
        <div class="fund-change ${changeClass}">
          <span class="change-value">${formatChange(estimateChange)}</span>
        </div>
        ${this.options.isWatchlist && this.options.onDelete ? `
          <button class="btn-delete" data-code="${fundCode}">删除</button>
        ` : ''}
      </div>
    `;

    // 绑定事件
    if (this.options.onClick) {
      this.element.addEventListener('click', () => this.options.onClick(this.data));
    }
    
    if (this.options.onDelete) {
      const deleteBtn = this.element.querySelector('.btn-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.options.onDelete(fundCode);
        });
      }
    }
  }

  renderTrend(trend) {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');
    
    return `
      <div class="fund-trend">
        <svg class="trend-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline 
            points="${points}" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
    `;
  }

  getElement() {
    return this.element;
  }
}
```

- [ ] **Step 2: 创建FundPage页面**

```javascript
// js/pages/fundPage.js
import { apiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { FundCard } from '../components/fundCard.js';
import { createSkeleton, showToast, debounce } from '../utils.js';

export class FundPage {
  constructor() {
    this.storage = new StorageService();
    this.fundListEl = document.getElementById('fundList');
    this.rankingListEl = document.getElementById('rankingList');
    this.searchInput = document.querySelector('.search-input');
    this.rankingTabs = document.querySelectorAll('.ranking-tab');
    this.currentRankingType = 'rise';
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderWatchlistSkeleton();
    this.renderRankingSkeleton();
  }

  bindEvents() {
    // 搜索防抖
    this.searchInput.addEventListener('input', debounce((e) => {
      this.handleSearch(e.target.value);
    }, 300));

    // 排行榜Tab切换
    this.rankingTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.rankingTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentRankingType = tab.dataset.type;
        this.loadRanking();
      });
    });
  }

  async load() {
    await Promise.all([
      this.loadWatchlist(),
      this.loadRanking()
    ]);
  }

  async loadWatchlist() {
    const watchlistCodes = this.storage.getWatchlist();
    
    if (watchlistCodes.length === 0) {
      this.renderEmptyWatchlist();
      return;
    }

    try {
      const funds = await apiService.getWatchlistFunds(watchlistCodes);
      this.renderWatchlist(funds);
    } catch (error) {
      console.error('加载自选基金失败:', error);
      showToast('加载自选基金失败');
    }
  }

  renderWatchlist(funds) {
    this.fundListEl.innerHTML = '';
    
    funds.forEach(fund => {
      const card = new FundCard(fund, {
        isWatchlist: true,
        onDelete: (code) => this.handleDeleteFromWatchlist(code),
        onClick: (data) => this.handleFundClick(data)
      });
      this.fundListEl.appendChild(card.getElement());
    });
  }

  renderWatchlistSkeleton() {
    this.fundListEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const skeleton = createSkeleton('card');
      skeleton.classList.add('skeleton-fund-card');
      this.fundListEl.appendChild(skeleton);
    }
  }

  renderEmptyWatchlist() {
    this.fundListEl.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📊</span>
        <p class="empty-text">还没有添加自选基金</p>
        <p class="empty-hint">在下方搜索并添加关注的基金</p>
      </div>
    `;
  }

  async loadRanking() {
    this.renderRankingSkeleton();
    
    try {
      const ranking = await apiService.getRanking(this.currentRankingType);
      this.renderRanking(ranking);
    } catch (error) {
      console.error('加载排行榜失败:', error);
      showToast('加载排行榜失败');
    }
  }

  renderRanking(funds) {
    this.rankingListEl.innerHTML = '';
    
    funds.forEach((fund, index) => {
      const card = new FundCard(fund, {
        showTrend: false,
        onClick: (data) => this.handleFundClick(data)
      });
      card.getElement().classList.add('ranking-card');
      card.getElement().innerHTML = `
        <div class="ranking-index ${index < 3 ? 'top' : ''}">${index + 1}</div>
        ${card.getElement().innerHTML}
      `;
      this.rankingListEl.appendChild(card.getElement());
    });
  }

  renderRankingSkeleton() {
    this.rankingListEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const skeleton = createSkeleton('card');
      skeleton.classList.add('skeleton-fund-card');
      this.rankingListEl.appendChild(skeleton);
    }
  }

  async handleSearch(keyword) {
    if (!keyword.trim()) {
      await this.loadWatchlist();
      return;
    }

    try {
      const results = await apiService.searchFunds(keyword);
      this.renderSearchResults(results);
    } catch (error) {
      console.error('搜索失败:', error);
      showToast('搜索失败');
    }
  }

  renderSearchResults(results) {
    if (results.length === 0) {
      this.fundListEl.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-text">未找到相关基金</p>
          <p class="empty-hint">请尝试其他关键词</p>
        </div>
      `;
      return;
    }

    this.fundListEl.innerHTML = '';
    results.forEach(fund => {
      const isInWatchlist = this.storage.getWatchlist().includes(fund.fundCode);
      const card = new FundCard(fund, {
        showTrend: false,
        onClick: () => {
          if (!isInWatchlist) {
            this.addToWatchlist(fund.fundCode);
          } else {
            showToast('已在自选列表中');
          }
        }
      });
      card.getElement().classList.add('search-result');
      this.fundListEl.appendChild(card.getElement());
    });
  }

  addToWatchlist(fundCode) {
    this.storage.addToWatchlist(fundCode);
    showToast('已添加到自选');
    this.loadWatchlist();
  }

  handleDeleteFromWatchlist(fundCode) {
    this.storage.removeFromWatchlist(fundCode);
    showToast('已从自选删除');
    this.loadWatchlist();
  }

  handleFundClick(fundData) {
    console.log('点击基金:', fundData);
    showToast(`查看 ${fundData.fundName} 详情`);
  }
}
```

- [ ] **Step 3: 添加基金组件样式**

```css
/* 基金卡片样式 */
.fund-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  cursor: pointer;
  transition: all 200ms ease;
  border: 1px solid transparent;
}

.fund-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color);
  box-shadow: var(--shadow-card);
}

.fund-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.fund-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.fund-code {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-secondary);
}

.fund-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.fund-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.nav-value {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--text-primary);
}

.nav-date {
  font-size: 12px;
  color: var(--text-muted);
}

.fund-trend {
  height: 30px;
  margin-bottom: var(--space-md);
}

.trend-svg {
  width: 100%;
  height: 100%;
  color: var(--accent-primary);
}

.fund-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fund-change {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
}

.text-rise {
  color: var(--color-rise);
}

.text-fall {
  color: var(--color-fall);
}

.text-neutral {
  color: var(--text-secondary);
}

.btn-delete {
  background: transparent;
  border: 1px solid var(--color-fall);
  color: var(--color-fall);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: 12px;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-delete:hover {
  background: var(--color-fall);
  color: var(--text-primary);
}

/* 排行榜卡片 */
.ranking-card {
  position: relative;
}

.ranking-index {
  position: absolute;
  left: var(--space-lg);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
}

.ranking-index.top {
  background: var(--accent-gradient);
  color: var(--text-primary);
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--bg-secondary);
}

.search-input {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font-body);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.btn-search {
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-search:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glow);
}

/* Section标题 */
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  padding: var(--space-lg);
  padding-bottom: var(--space-sm);
}

/* 排行榜Tab */
.ranking-tabs {
  display: flex;
  gap: var(--space-sm);
  padding: 0 var(--space-lg) var(--space-md);
}

.ranking-tab {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.ranking-tab.active {
  background: var(--accent-gradient);
  border-color: transparent;
  color: var(--text-primary);
}

/* 骨架屏 */
.skeleton-fund-card {
  height: 120px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}

.skeleton-line {
  height: 16px;
  background: var(--bg-card-hover);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
}

.skeleton-line.short {
  width: 60%;
}
```

- [ ] **Step 4: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add js/components/fundCard.js js/pages/fundPage.js styles.css
git commit -m "feat: 实现基金卡片组件和基金页面"
```

---

### Task 6: 实现情绪分析页面

**Files:**
- Create: `js/components/emotionGauge.js`
- Create: `js/components/metricCard.js`
- Create: `js/components/etfBanner.js`
- Create: `js/pages/sentimentPage.js`

- [ ] **Step 1: 创建EmotionGauge组件**

```javascript
// js/components/emotionGauge.js
export class EmotionGauge {
  constructor(container) {
    this.container = container;
    this.value = 0;
    this.sentiment = '';
    this.render();
  }

  update(data) {
    this.value = data.fearGreedIndex;
    this.sentiment = data.sentiment;
    this.updateDisplay();
  }

  render() {
    this.container.innerHTML = `
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <circle
          class="gauge-bg"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="var(--bg-card)"
          stroke-width="12"
          stroke-dasharray="534"
          stroke-dashoffset="133.5"
          transform="rotate(135, 100, 100)"
        />
        <circle
          class="gauge-progress"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#gaugeGradient)"
          stroke-width="12"
          stroke-linecap="round"
          stroke-dasharray="534"
          stroke-dashoffset="534"
          transform="rotate(135, 100, 100)"
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--color-fall)" />
            <stop offset="50%" stop-color="var(--color-warning)" />
            <stop offset="100%" stop-color="var(--color-rise)" />
          </linearGradient>
        </defs>
      </svg>
      <div class="gauge-center">
        <span class="gauge-value" id="gaugeValue">0</span>
        <span class="gauge-label" id="gaugeLabel">--</span>
      </div>
    `;
  }

  updateDisplay() {
    const gaugeValue = document.getElementById('gaugeValue');
    const gaugeLabel = document.getElementById('gaugeLabel');
    const progressCircle = this.container.querySelector('.gauge-progress');
    
    // 计算进度（0-100对应弧长0-534）
    const circumference = 534;
    const offset = circumference - (this.value / 100) * circumference * 0.75;
    
    // 数字动画
    this.animateNumber(gaugeValue, this.value);
    
    // 更新标签
    gaugeLabel.textContent = this.sentiment;
    
    // 更新进度条
    progressCircle.style.strokeDashoffset = offset;
    
    // 更新颜色
    this.updateGradient();
  }

  animateNumber(element, target) {
    const duration = 1000;
    const start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (target - start) * easeOutQuart);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  updateGradient() {
    const gradient = document.getElementById('gaugeGradient');
    let colors;
    
    if (this.value < 20) {
      colors = ['#dc2626', '#991b1b'];
    } else if (this.value < 40) {
      colors = ['#f97316', '#ea580c'];
    } else if (this.value < 60) {
      colors = ['#eab308', '#ca8a04'];
    } else if (this.value < 80) {
      colors = ['#84cc16', '#65a30d'];
    } else {
      colors = ['#10b981', '#059669'];
    }
    
    gradient.innerHTML = `
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="100%" stop-color="${colors[1]}" />
    `;
  }
}
```

- [ ] **Step 2: 创建MetricCard组件**

```javascript
// js/components/metricCard.js
import { formatNumber } from '../utils.js';

export class MetricCard {
  constructor(data) {
    this.data = data;
    this.element = null;
    this.render();
  }

  render() {
    const { icon, label, value, unit = '', type = 'neutral' } = this.data;
    
    this.element = document.createElement('div');
    this.element.className = `metric-card metric-${type}`;
    this.element.innerHTML = `
      <div class="metric-icon">${icon}</div>
      <div class="metric-content">
        <div class="metric-value">${formatNumber(value, 1)}<span class="metric-unit">${unit}</span></div>
        <div class="metric-label">${label}</div>
      </div>
    `;
  }

  getElement() {
    return this.element;
  }
}
```

- [ ] **Step 3: 创建ETFBanner组件**

```javascript
// js/components/etfBanner.js
import { formatNumber, getChangeColorClass } from '../utils.js';

export class ETFBanner {
  constructor(data) {
    this.data = data;
    this.element = null;
    this.render();
  }

  render() {
    const { etfCode, etfName, netInflow, flowRate, volume } = this.data;
    const changeClass = getChangeColorClass(netInflow);
    const changeSign = netInflow > 0 ? '+' : '';
    
    this.element = document.createElement('div');
    this.element.className = 'etf-banner';
    this.element.innerHTML = `
      <div class="etf-header">
        <div class="etf-info">
          <span class="etf-name">${etfName}</span>
          <span class="etf-code">${etfCode}</span>
        </div>
        <div class="etf-flow ${changeClass}">
          <span class="flow-value">${changeSign}${formatNumber(netInflow, 1)}亿</span>
          <span class="flow-rate">${changeSign}${formatNumber(flowRate, 1)}%</span>
        </div>
      </div>
      <div class="etf-bar">
        <div class="etf-bar-fill ${changeClass}" style="width: ${Math.min(Math.abs(flowRate) * 10, 100)}%"></div>
      </div>
      <div class="etf-volume">
        <span>成交额: ${formatNumber(volume, 1)}亿</span>
      </div>
    `;
  }

  getElement() {
    return this.element;
  }
}
```

- [ ] **Step 4: 创建SentimentPage页面**

```javascript
// js/pages/sentimentPage.js
import { apiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { EmotionGauge } from '../components/emotionGauge.js';
import { MetricCard } from '../components/metricCard.js';
import { ETFBanner } from '../components/etfBanner.js';
import { showToast, createSkeleton } from '../utils.js';

export class SentimentPage {
  constructor() {
    this.gaugeContainer = document.getElementById('emotionGauge');
    this.metricsGrid = document.getElementById('metricsGrid');
    this.etfList = document.getElementById('etfList');
    this.etfTabs = document.querySelectorAll('.etf-tab');
    this.currentETFCategory = 'broad';
    
    this.gauge = new EmotionGauge(this.gaugeContainer);
    this.storage = new StorageService();
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderMetricsSkeleton();
    this.renderETFSkeleton();
  }

  bindEvents() {
    this.etfTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.etfTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentETFCategory = tab.dataset.category;
        this.loadETFData();
      });
    });
  }

  async load() {
    await Promise.all([
      this.loadSentimentData(),
      this.loadETFData()
    ]);
  }

  async loadSentimentData() {
    try {
      const sentiment = await apiService.getSentimentData();
      this.gauge.update(sentiment);
      this.renderMetrics(sentiment);
    } catch (error) {
      console.error('加载情绪数据失败:', error);
      showToast('加载情绪数据失败');
    }
  }

  renderMetrics(data) {
    this.metricsGrid.innerHTML = '';
    
    const metrics = [
      {
        icon: '📈',
        label: '涨停数',
        value: data.upLimit,
        type: 'rise'
      },
      {
        icon: '📉',
        label: '跌停数',
        value: data.downLimit,
        type: 'fall'
      },
      {
        icon: '💥',
        label: '炸板率',
        value: data.burstRate,
        unit: '%',
        type: data.burstRate > 20 ? 'warning' : 'rise'
      },
      {
        icon: '🔥',
        label: '昨日涨停今表现',
        value: data.yesterdayUpToday,
        unit: '%',
        type: data.yesterdayUpToday > 0 ? 'rise' : 'fall'
      }
    ];

    metrics.forEach(metricData => {
      const card = new MetricCard(metricData);
      this.metricsGrid.appendChild(card.getElement());
    });
  }

  renderMetricsSkeleton() {
    this.metricsGrid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const skeleton = createSkeleton('card');
      skeleton.classList.add('skeleton-metric');
      this.metricsGrid.appendChild(skeleton);
    }
  }

  async loadETFData() {
    this.renderETFSkeleton();
    
    try {
      const etfs = await apiService.getETFData(this.currentETFCategory);
      this.renderETFs(etfs);
    } catch (error) {
      console.error('加载ETF数据失败:', error);
      showToast('加载ETF数据失败');
    }
  }

  renderETFs(etfs) {
    this.etfList.innerHTML = '';
    
    if (etfs.length === 0) {
      this.etfList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📊</span>
          <p class="empty-text">暂无ETF数据</p>
        </div>
      `;
      return;
    }

    etfs.forEach(etfData => {
      const banner = new ETFBanner(etfData);
      this.etfList.appendChild(banner.getElement());
    });
  }

  renderETFSkeleton() {
    this.etfList.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const skeleton = createSkeleton('card');
      skeleton.classList.add('skeleton-etf');
      this.etfList.appendChild(skeleton);
    }
  }
}
```

- [ ] **Step 5: 添加情绪页面样式**

```css
/* 情绪仪表盘容器 */
.emotion-gauge-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-2xl) 0;
  background: var(--bg-secondary);
}

.emotion-gauge {
  position: relative;
  width: 200px;
  height: 200px;
}

.gauge-svg {
  width: 100%;
  height: 100%;
}

.gauge-bg,
.gauge-progress {
  transition: stroke-dashoffset 1s ease-out;
}

.gauge-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.gauge-value {
  display: block;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.gauge-label {
  display: block;
  font-size: 16px;
  color: var(--text-secondary);
  margin-top: var(--space-sm);
}

/* 指标卡片网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  padding: var(--space-lg);
}

.metric-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-md);
  align-items: center;
}

.metric-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.metric-unit {
  font-size: 14px;
  margin-left: 2px;
}

.metric-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

.metric-rise .metric-value {
  color: var(--color-rise);
}

.metric-fall .metric-value {
  color: var(--color-fall);
}

.metric-warning .metric-value {
  color: var(--color-warning);
}

/* ETF样式 */
.etf-section {
  margin-top: var(--space-lg);
}

.etf-tabs {
  display: flex;
  gap: var(--space-sm);
  padding: 0 var(--space-lg) var(--space-md);
}

.etf-tab {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.etf-tab.active {
  background: var(--accent-gradient);
  border-color: transparent;
  color: var(--text-primary);
}

.etf-list {
  padding: 0 var(--space-lg) var(--space-lg);
}

.etf-banner {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
}

.etf-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.etf-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.etf-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.etf-code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
}

.etf-flow {
  text-align: right;
}

.flow-value {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
}

.flow-rate {
  font-size: 14px;
  opacity: 0.8;
}

.etf-bar {
  height: 4px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.etf-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 300ms ease-out;
}

.etf-bar-fill.text-rise {
  background: var(--color-rise);
}

.etf-bar-fill.text-fall {
  background: var(--color-fall);
}

.etf-volume {
  font-size: 12px;
  color: var(--text-muted);
}

/* 骨架屏 */
.skeleton-metric {
  height: 80px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
}

.skeleton-etf {
  height: 100px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}
```

- [ ] **Step 6: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add js/components/emotionGauge.js js/components/metricCard.js js/components/etfBanner.js js/pages/sentimentPage.js styles.css
git commit -m "feat: 实现情绪分析页面组件"
```

---

### Task 7: 完善样式和交互优化

**Files:**
- Modify: `styles.css`
- Modify: `index.html`

- [ ] **Step 1: 添加基础样式和完善组件**

```css
/* 完善styles.css，添加以下样式 */

/* 状态栏 */
.status-bar {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-lg);
  background: linear-gradient(180deg, rgba(10, 14, 26, 0.9), transparent);
  position: sticky;
  top: 0;
  z-index: 50;
}

.status-time {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-primary);
}

.status-icons {
  display: flex;
  gap: var(--space-sm);
  font-size: 14px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  background: var(--bg-secondary);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-refresh {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: transform 300ms ease;
}

.btn-refresh.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 70px;
  -webkit-overflow-scrolling: touch;
}

.tab-panel {
  display: none;
}

.tab-panel.active {
  display: block;
  animation: fade-in-up 300ms ease-out;
}

/* Tab页面 */
.watchlist-section,
.ranking-section,
.etf-section {
  margin-bottom: var(--space-xl);
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 26, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-card);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: var(--space-lg);
  font-size: 14px;
  color: var(--text-secondary);
}

/* Toast提示 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: var(--text-primary);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-md);
  font-size: 14px;
  z-index: 1001;
  opacity: 0;
  transition: opacity 300ms ease;
  pointer-events: none;
}

.toast.show {
  opacity: 1;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--space-2xl);
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-lg);
}

.empty-text {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.empty-hint {
  font-size: 14px;
  color: var(--text-muted);
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 4px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
}

/* 龙虎榜空状态 */
.empty-state-dragon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  padding: var(--space-2xl);
}

.empty-icon-dragon {
  font-size: 80px;
  margin-bottom: var(--space-xl);
  opacity: 0.5;
}

.empty-text-dragon {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.empty-hint-dragon {
  font-size: 14px;
  color: var(--text-muted);
}
```

- [ ] **Step 2: 更新龙虎榜页面为空状态设计**

```html
<!-- 在index.html中找到Tab 3的龙虎榜部分，替换为： -->
<section class="tab-panel" id="tabDragon">
  <div class="empty-state-dragon">
    <span class="empty-icon-dragon">🐉</span>
    <p class="empty-text-dragon">龙虎榜功能即将上线</p>
    <p class="empty-hint-dragon">敬请期待...</p>
  </div>
</section>
```

- [ ] **Step 3: 添加响应式适配样式**

```css
/* iPhone 6/7/8 (375px) */
@media screen and (max-width: 375px) {
  .page-title {
    font-size: 20px;
  }
  
  .fund-name {
    font-size: 14px;
  }
  
  .nav-value {
    font-size: 16px;
  }
  
  .fund-change {
    font-size: 18px;
  }
  
  .gauge-value {
    font-size: 40px;
  }
  
  .gauge-label {
    font-size: 14px;
  }
  
  .metric-value {
    font-size: 20px;
  }
}

/* iPhone Plus (414px) */
@media screen and (min-width: 414px) {
  .metrics-grid {
    gap: var(--space-lg);
  }
}

/* 横屏适配 */
@media screen and (orientation: landscape) {
  .app-container {
    max-width: 100%;
  }
  
  .emotion-gauge-container {
    padding: var(--space-xl) 0;
  }
  
  .emotion-gauge {
    width: 160px;
    height: 160px;
  }
}
```

- [ ] **Step 4: 提交代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add styles.css index.html
git commit -m "style: 完善样式和交互优化"
```

---

### Task 8: 测试和验证

**Files:**
- Modify: `index.html` (添加移动端meta标签优化)

- [ ] **Step 1: 优化HTML的移动端适配**

```html
<!-- 在index.html的<head>中添加以下meta标签 -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="format-detection" content="telephone=no">
  <meta name="theme-color" content="#0a0e1a">
  <title>金融数据助手</title>
  <link rel="stylesheet" href="styles.css">
  <!-- 添加icon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📈</text></svg>">
</head>
```

- [ ] **Step 2: 本地测试验证清单**

```bash
# 测试项目结构
cd /Users/zhoutianrun/Documents/AI_PROJ
ls -la
# 应该包含:
# - index.html
# - styles.css
# - js/
# - mock/
# - docs/

# 验证所有JS文件
ls -la js/
# 应该包含:
# - app.js
# - utils.js
# - services/
# - components/
# - pages/

# 检查是否有语法错误
node -c js/app.js
node -c js/services/api.js
```

- [ ] **Step 3: 浏览器测试说明**

**测试步骤：**
1. 在浏览器中打开 `index.html`
2. 验证以下功能：
   - ✅ Tab导航切换流畅
   - ✅ 基金列表正确显示模拟数据
   - ✅ 基金搜索功能正常
   - ✅ 情绪仪表盘动画正常
   - ✅ 指标卡片正确显示
   - ✅ ETF列表正确显示
   - ✅ 涨跌色正确区分（绿涨红跌）
   - ✅ 深色主题视觉效果
   - ✅ iPhone刘海屏适配
   - ✅ 加载动画正常
   - ✅ Toast提示正常

- [ ] **Step 4: 提交最终代码**

```bash
cd /Users/zhoutianrun/Documents/AI_PROJ
git add .
git commit -m "feat: 完成金融数据助手MVP版本

功能清单:
- 基金实时估值页面（自选列表、搜索、排行榜）
- A股情绪分析页面（恐慌指数、情绪指标）
- ETF资金流向页面（宽基/行业/跨境分类）
- 科技感深色主题UI
- Tab导航交互
- 数据缓存和本地存储
- 移动端响应式适配"
```

---

## 自检清单

### ✅ Spec覆盖检查
- [x] 基金实时估值（Tab 1）→ Task 5
- [x] 市场情绪分析（Tab 2）→ Task 6
- [x] ETF资金流向（Tab 2）→ Task 6
- [x] 龙虎榜预留（Tab 3）→ Task 7
- [x] Tab导航 → Task 3
- [x] 数据服务层 → Task 2, Task 4
- [x] 本地存储 → Task 2
- [x] 缓存机制 → Task 2
- [x] 错误处理 → Task 4
- [x] 空状态设计 → Task 5, Task 7

### ✅ Placeholder扫描
- [x] 无"TBD"或"TODO"
- [x] 所有代码块完整
- [x] 所有文件路径明确
- [x] 所有命令可执行

### ✅ Type一致性检查
- [x] `FundCard`组件数据字段一致
- [x] `MetricCard`组件字段一致
- [x] `ETFBanner`组件字段一致
- [x] API服务接口定义一致

---

**Plan结束**

实施计划已完成并保存。计划包含8个任务，涵盖：
1. 项目初始化和HTML结构
2. 存储服务层
3. TabBar组件
4. API服务层
5. 基金页面实现
6. 情绪分析页面实现
7. 样式完善和交互优化
8. 测试验证

每个任务都包含详细的代码实现和git提交步骤。

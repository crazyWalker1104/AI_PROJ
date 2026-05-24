# 金融数据助手 - 微信小程序原型设计文档

## 文档信息

- **项目名称**：金融数据助手（Fund Data Assistant）
- **版本**：v1.0 MVP
- **日期**：2026-05-24
- **状态**：待审核
- **作者**：AI Assistant

---

## 1. 项目概述

### 1.1 项目背景

为基金爱好者打造的专业金融数据查询小程序原型。核心解决基金实时估值查询、市场情绪分析、ETF资金流向等投资决策辅助需求。

### 1.2 目标用户

- **主要用户**：基金爱好者
- **核心需求**：
  - 基金实时估值查询
  - 市场情绪分析
  - ETF流入流出分析
- **使用场景**：日常投资决策参考、基金持仓管理

### 1.3 技术选型

- **实现方案**：Web原型（HTML5 + CSS3 + JavaScript）
- **架构特点**：单页应用 + 底部Tab导航
- **数据源**：东方财富API + tushare API
- **刷新策略**：手动刷新（预留实时扩展能力）
- **存储方案**：localStorage（自选基金 + 数据缓存）

### 1.4 MVP范围

#### 包含功能
✅ 基金实时估值（自选列表 + 搜索 + 排行榜）
✅ A股情绪分析（恐慌指数 + 情绪指标）
✅ ETF资金流向

#### 暂不包含（第二版）
⏸️ 龙虎榜功能
⏸️ 基金详情页（历史业绩、基金经理）
⏸️ 实时WebSocket推送

---

## 2. 功能规格

### 2.1 Tab 1 - 基金实时估值

#### 2.1.1 自选基金列表

**功能描述**：展示用户关注的基金列表，支持添加/删除操作

**数据字段**：
- `fundCode`：基金代码
- `fundName`：基金名称
- `estimateNav`：估算净值
- `navDate`：净值日期
- `estimateChange`：估算涨跌幅（%）
- `trend`：今日估值走势（数组）

**交互操作**：
- 下拉刷新：获取最新估值数据
- 点击卡片：展开/收起详情
- 长按/滑动：删除自选
- 点击"+添加"：搜索并添加基金

**状态处理**：
- 空状态：无自选基金时显示引导添加UI
- 加载状态：骨架屏动画
- 错误状态：显示重试按钮

#### 2.1.2 基金搜索

**功能描述**：按基金代码或名称搜索基金

**交互流程**：
1. 点击搜索框 → 展开搜索面板
2. 输入关键词 → 实时搜索建议
3. 选择基金 → 添加到自选
4. 自动收起搜索面板

**搜索来源**：
- 调用东方财富基金搜索API
- 支持代码模糊匹配
- 支持名称关键词匹配

#### 2.1.3 估值排行榜

**功能描述**：展示今日涨幅/跌幅最大的基金

**排行榜类型**：
- 涨幅榜：今日估算涨幅最高
- 跌幅榜：今日估算跌幅最大

**展示规则**：
- 显示前20名
- 区分股票型/混合型/债券型
- 点击可添加到自选

---

### 2.2 Tab 2 - A股情绪分析

#### 2.2.1 恐慌贪婪指数仪表盘

**功能描述**：环形进度仪表盘展示市场情绪指数

**数据字段**：
- `fearGreedIndex`：指数值（0-100）
- `sentiment`：情绪标签（恐慌/中性/贪婪）
- `updateTime`：更新时间

**仪表盘规则**：
| 指数范围 | 情绪标签 | 颜色 |
|---------|---------|------|
| 0-20 | 极度恐慌 | 红色渐变 |
| 21-40 | 恐慌 | 橙色渐变 |
| 41-60 | 中性 | 黄色渐变 |
| 61-80 | 贪婪 | 浅绿渐变 |
| 81-100 | 极度贪婪 | 绿色渐变 |

**交互**：
- 页面加载：数字从0滚动到当前值
- 下拉刷新：重新获取数据

#### 2.2.2 市场情绪指标卡片

**功能描述**：展示关键市场情绪数据

**指标项**：

1. **涨停数**（`upLimit`）
   - 今日涨停股票数量
   - 图标：📈
   - 颜色：绿色

2. **跌停数**（`downLimit`）
   - 今日跌停股票数量
   - 图标：📉
   - 颜色：红色

3. **炸板率**（`burstRate`）
   - 涨停打开比例（%）
   - 计算：炸板数 / 涨停数 × 100%
   - 图标：💥
   - 颜色：橙色（高）/ 绿色（低）

4. **昨日涨停今表现**（`yesterdayUpToday`）
   - 昨日涨停股今日平均涨幅（%）
   - 正值：次日溢价（好）
   - 负值：次日低开（差）
   - 图标：🔥

**布局**：2×2网格卡片布局

#### 2.2.3 ETF资金流向

**功能描述**：展示主要ETF资金流入流出情况

**数据字段**：
- `etfCode`：ETF代码
- `etfName`：ETF名称
- `netInflow`：净流入（亿元）
- `flowRate`：流入率（%）
- `volume`：成交额（亿元）

**ETF分类**：
1. 宽基ETF：沪深300、中证500、上证50、创业板、科创50
2. 行业ETF：证券、银行、军工、医药、新能源等
3. 跨境ETF：纳指、标普、日经等

**交互**：
- Tab切换：按分类查看
- 点击详情：查看历史资金流向（第二版）

---

## 3. 数据架构

### 3.1 模块化架构

```
┌─────────────────────────────────────┐
│           UI Layer (HTML/CSS)       │
│  - Tab页面结构                       │
│  - 组件模板                          │
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│       Component Layer (JS)          │
│  - FundCard组件                      │
│  - EmotionGauge组件                  │
│  - MetricCard组件                    │
│  - ETFBanner组件                     │
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│       Service Layer (JS)            │
│  - DataService（数据获取）            │
│  - CacheService（缓存管理）           │
│  - StorageService（本地存储）          │
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│       API Layer                      │
│  - 东方财富API适配器                  │
│  - tushare API适配器                  │
│  - MockDataService（模拟数据）        │
└─────────────────────────────────────┘
```

### 3.2 数据服务接口设计

#### IFundService
```javascript
interface IFundService {
  // 获取自选基金列表
  getWatchlist(): Promise<Fund[]>;
  
  // 搜索基金
  searchFunds(keyword: string): Promise<Fund[]>;
  
  // 添加自选
  addToWatchlist(fundCode: string): Promise<void>;
  
  // 删除自选
  removeFromWatchlist(fundCode: string): Promise<void>;
  
  // 获取估值排行榜
  getRanking(type: 'rise' | 'fall'): Promise<Fund[]>;
}
```

#### ISentimentService
```javascript
interface ISentimentService {
  // 获取恐慌贪婪指数
  getFearGreedIndex(): Promise<SentimentData>;
  
  // 获取市场情绪指标
  getMarketMetrics(): Promise<MarketMetrics>;
}
```

#### IETFService
```javascript
interface IETFService {
  // 获取ETF资金流向
  getETFFlow(category?: ETFCategory): Promise<ETF[]>;
}
```

### 3.3 缓存策略

| 数据类型 | 缓存时间 | 过期策略 |
|---------|---------|---------|
| 自选基金列表 | 永久 | 用户修改时更新 |
| 估值数据 | 5分钟 | 时间过期 + 用户刷新 |
| 情绪指标 | 15分钟 | 时间过期 + 用户刷新 |
| ETF流向 | 30分钟 | 时间过期 + 用户刷新 |

### 3.4 数据降级策略

```
用户请求数据
    ↓
尝试调用真实API
    ↓
成功？──是──→ 返回真实数据
    ↓否
记录错误日志
    ↓
检查缓存──有──→ 返回缓存数据 + 提示"数据可能有延迟"
    ↓无
返回默认空状态 + 错误提示
```

---

## 4. API对接方案

### 4.1 东方财富API

**基金搜索接口**：
```
URL: https://fund.eastmoney.com/interface/FundSearch.aspx
Method: JSONP
参数: keyword, type, page, pagesize
```

**基金实时估值**：
```
URL: https://fundgz.1234567.com.cn/js/{fundCode}.js
Method: JSONP
参数: rt={timestamp}
返回: gztime, gz, gszzl, gsz, gsdate
```

### 4.2 tushare API

**情绪数据**（需注册获取token）：
```
URL: https://api.tushare.pro
Method: POST
接口: daily_basic（涨跌停统计）
```

### 4.3 跨域解决方案

- 东方财富JSONP接口：直接前端调用
- tushare API：需要后端代理（Node.js中间件）

---

## 5. 视觉规格

### 5.1 设计系统

#### 颜色变量
```css
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
  
  /* 边框 */
  --border-color: rgba(99, 102, 241, 0.2);
  
  /* 阴影 */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
}
```

#### 字体系统
```css
/* 数字字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

/* 中文字体 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

/* 等宽字体 */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Orbitron', monospace;
  --font-body: 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### 间距系统
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}
```

### 5.2 组件设计

#### 状态栏（StatusBar）
- 高度：44px
- 背景：透明渐变
- 内容：左侧空白 + 中间时间 + 右侧系统图标
- 适配：iPhone刘海屏（44px顶部安全区）

#### TabBar
- 高度：60px + 底部安全区
- 背景：毛玻璃效果 `backdrop-filter: blur(20px)`
- Tab项：图标（24px）+ 文字（12px）
- 指示器：底部渐变条，宽度与Tab文字等宽

#### 基金卡片（FundCard）
```
┌─────────────────────────────────────┐
│ [基金代码]        [估算净值]  [时间]  │
│ 基金名称                            │
│ ─────────────────────────────────── │
│ [趋势迷你图]                         │
│                        [+涨跌幅]     │
└─────────────────────────────────────┘
```
- 背景：`--bg-card`
- 圆角：`--radius-md`（12px）
- 内边距：`--space-lg`（16px）
- 涨跌色：右上角涨跌幅数字

#### 情绪仪表盘（EmotionGauge）
- 尺寸：200px × 200px
- 环形宽度：12px
- 中心数字：48px Orbitron字体
- 颜色：根据数值渐变

#### 指标卡片（MetricCard）
```
┌───────────────────┐
│ [图标]  [数值]    │
│      [标签]       │
└───────────────────┘
```
- 网格布局：2×2
- 图标：24px emoji
- 数值：32px Orbitron
- 标签：14px Noto Sans SC

#### ETF条目（ETFBanner）
```
┌─────────────────────────────────────┐
│ [ETF名称]  [代码]                   │
│ 净流入：+12.5亿    [迷你柱状图]      │
│ 流入率：2.3%                       │
└─────────────────────────────────────┘
```

### 5.3 动效规格

#### Tab切换
```css
.tab-indicator {
  transition: transform 200ms ease-out;
}
```

#### 数据更新数字跳动
```css
@keyframes number-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

#### 卡片加载骨架屏
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

#### 页面进入动画
```css
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
```

#### 下拉刷新
- 触发阈值：80px
- 动画：旋转loading图标
- 反馈：文字提示"放开刷新"

---

## 6. 错误处理

### 6.1 网络错误

| 错误类型 | 用户提示 | 恢复策略 |
|---------|---------|---------|
| 网络断开 | "网络连接失败，请检查网络" | 自动重试（3次）+ 手动重试按钮 |
| API超时 | "数据加载超时" | 重试按钮 |
| API限流 | "请求过于频繁，请稍后再试" | 倒计时提示 |

### 6.2 数据错误

| 场景 | 处理方式 |
|------|---------|
| 数据为空 | 显示空状态插画 + "暂无数据"文案 |
| 数据格式错误 | 降级到缓存数据 + 错误日志 |
| 数据过期 | 显示"数据更新于X分钟前"提示 |

### 6.3 空状态设计

**无自选基金**：
```
┌─────────────────────────────────────┐
│                                     │
│         [空状态插画/图标]            │
│                                     │
│      还没有添加自选基金              │
│                                     │
│      [立即添加自选基金]              │
│                                     │
└─────────────────────────────────────┘
```

---

## 7. 本地存储设计

### 7.1 localStorage结构

```javascript
// 自选基金列表
localStorage.setItem('fund_watchlist', JSON.stringify({
  version: 1,
  funds: ['000001', '110022', '420001'],
  updatedAt: '2024-01-15T10:30:00'
}));

// 数据缓存
localStorage.setItem('fund_cache', JSON.stringify({
  version: 1,
  data: { /* 基金数据 */ },
  expireAt: '2024-01-15T10:35:00'  // 5分钟后过期
}));

// 用户偏好
localStorage.setItem('user_preferences', JSON.stringify({
  activeTab: 'funds',  // 上次查看的Tab
  etfCategory: 'broad',  // ETF分类偏好
  rankingType: 'rise'  // 排行榜类型偏好
}));
```

---

## 8. 响应式策略

### 8.1 移动端优先

- 设计基准：375px（iPhone 6/7/8）
- 最大宽度：480px（居中显示）
- 触摸优化：最小点击区域44px

### 8.2 安全区域适配

```css
/* iPhone刘海屏适配 */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 9. 验收标准

### 9.1 功能验收

- [ ] Tab切换流畅，无明显延迟
- [ ] 基金搜索可按代码/名称搜索
- [ ] 自选基金可添加/删除，数据持久化
- [ ] 估值数据可刷新更新
- [ ] 情绪仪表盘正确显示
- [ ] ETF列表正确展示资金流向
- [ ] 空状态有友好引导

### 9.2 视觉验收

- [ ] 深色科技风格主题一致
- [ ] 涨跌色正确区分（绿涨红跌）
- [ ] 动画流畅，无卡顿
- [ ] 适配iPhone刘海屏
- [ ] 响应式布局正常

### 9.3 性能验收

- [ ] 首屏加载 < 3秒
- [ ] Tab切换 < 100ms
- [ ] 数据刷新 < 2秒

---

## 10. 未来扩展方向

### 第二版功能
- 龙虎榜功能
- 基金详情页（历史业绩、基金经理）
- 实时WebSocket推送
- 推送通知

### 技术升级
- 转换为微信小程序（使用Taro框架）
- 后端代理服务（解决tushare跨域）
- 用户登录系统

---

## 附录

### A. 模拟数据结构

#### 基金数据
```javascript
const mockFund = {
  fundCode: '000001',
  fundName: '平安优选混合A',
  estimateNav: 1.2345,
  navDate: '2024-01-15',
  estimateChange: 2.35,
  trend: [1.20, 1.22, 1.25, 1.23, 1.2345]
};
```

#### 情绪数据
```javascript
const mockSentiment = {
  fearGreedIndex: 72,
  sentiment: '偏多',
  upLimit: 45,
  downLimit: 8,
  burstRate: 15.2,
  yesterdayUpToday: 3.5,
  updateTime: '10:30:00'
};
```

#### ETF数据
```javascript
const mockETF = {
  etfCode: '510300',
  etfName: '华泰柏瑞沪深300ETF',
  netInflow: 12.5,
  flowRate: 2.3,
  volume: 85.6
};
```

### B. 依赖资源

- Google Fonts: Orbitron, Noto Sans SC, JetBrains Mono
- 图标库：内联SVG（自定义图标）

---

**文档结束**

# 金融数据助手 - 微信小程序原型设计文档

## 文档信息

- **项目名称**：金融数据助手（Fund Data Assistant）
- **版本**：v1.0 MVP
- **日期**：2026-05-24
- **状态**：✅ 已实现
- **作者**：AI Assistant

---

## 1. 项目概述

### 1.1 项目背景

为基金爱好者打造的专业金融数据查询小程序原型。核心解决基金实时估值查询、市场情绪分析、ETF资金流向、龙虎榜等投资决策辅助需求。

### 1.2 目标用户

- **主要用户**：基金爱好者
- **核心需求**：
  - 基金实时估值查询
  - 市场情绪分析
  - ETF流入流出分析
  - 龙虎榜数据查询
- **使用场景**：日常投资决策参考、基金持仓管理

### 1.3 技术选型

- **实现方案**：微信小程序（原生 WXML + WXSS + JS + JSON）
- **架构特点**：组件化架构 + 底部Tab导航
- **数据源**：Mock模拟数据
- **刷新策略**：下拉刷新
- **存储方案**：本地组件状态

### 1.4 MVP范围

#### 包含功能
✅ 基金实时估值（自选列表 + 搜索 + 排行榜 + 趋势图表）
✅ A股情绪分析（恐慌指数 + 情绪指标 + ETF资金流向）
✅ 龙虎榜（股票列表 + 营业部排行 + 日期筛选）

---

## 2. 功能规格

### 2.1 Tab 1 - 基金实时估值

#### 2.1.1 自选基金列表

**功能描述**：展示用户关注的基金列表，支持删除操作

**数据字段**：
- `code`：基金代码
- `name`：基金名称
- `estimateNav`：估算净值
- `navDate`：净值日期
- `estimateChange`：估算涨跌幅（%）
- `trend`：今日估值走势（数组）

**交互操作**：
- 下拉刷新：获取最新估值数据
- 点击卡片：显示基金名称 Toast
- 长按卡片：删除自选
- 搜索栏：搜索并添加基金

**状态处理**：
- 空状态：显示引导添加提示
- 下拉刷新：显示成功 Toast

#### 2.1.2 基金搜索

**功能描述**：按基金代码或名称搜索基金

**交互流程**：
1. 输入关键词 → 实时搜索建议
2. 点击搜索按钮 → 确认搜索并显示结果
3. 点击结果 → 显示基金名称

**搜索规则**：
- 支持代码模糊匹配（不区分大小写）
- 支持名称关键词匹配（不区分大小写）
- 无结果时显示友好提示

#### 2.1.3 估值排行榜

**功能描述**：展示今日涨幅/跌幅最大的基金

**排行榜类型**：
- 涨幅榜：今日估算涨幅最高
- 跌幅榜：今日估算跌幅最大

**展示规则**：
- 按涨跌幅排序
- 点击Tab切换榜单类型

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
| 0-30 | 恐慌 | 红色渐变 |
| 31-70 | 中性 | 黄色渐变 |
| 71-100 | 贪婪 | 绿色渐变 |

**组件实现**：
- CSS 环形进度条
- 中心显示数值和标签
- 颜色根据数值动态变化

#### 2.2.2 市场情绪指标卡片

**功能描述**：展示关键市场情绪数据

**指标项**：

1. **涨停数**（`upLimit`）
   - 图标：📈
   - 颜色：绿色

2. **跌停数**（`downLimit`）
   - 图标：📉
   - 颜色：红色

3. **炸板率**（`burstRate`）
   - 图标：💥
   - 颜色：橙色

4. **昨日涨停今表现**（`yesterdayUpToday`）
   - 图标：🔥
   - 颜色：根据正负值变化

**布局**：2×2网格卡片布局

#### 2.2.3 ETF资金流向

**功能描述**：展示主要ETF资金流入流出情况

**ETF分类**：
1. 宽基ETF：沪深300、中证500、上证50、创业板、科创50
2. 行业ETF：证券、银行、军工、医药、新能源等
3. 跨境ETF：纳指、标普、日经等

**交互**：
- Tab切换：按分类查看
- 柱状图：可视化展示流入率
- 涨绿跌红区分

---

### 2.3 Tab 3 - 龙虎榜

#### 2.3.1 龙虎榜列表

**功能描述**：展示龙虎榜上榜股票

**数据字段**：
- `code`：股票代码
- `name`：股票名称
- `reason`：上榜原因
- `institutionBuy`：机构买入
- `institutionSell`：机构卖出
- `dealerBuy`：营业部买入
- `dealerSell`：营业部卖出

**交互操作**：
- 日期选择：picker 选择日期
- 展开/收起：查看详细数据
- 下拉刷新：刷新数据

#### 2.3.2 实力营业部排行

**功能描述**：展示实力营业部的买卖统计

**数据字段**：
- `name`：营业部名称
- `buyAmount`：买入金额（万）
- `sellAmount`：卖出金额（万）

**布局**：排名列表 + 买/卖金额统计

---

## 3. 数据架构

### 3.1 模块化架构

```
┌─────────────────────────────────────┐
│           页面层 (WXML)              │
│  - pages/fund/fund                  │
│  - pages/sentiment/sentiment        │
│  - pages/dragon/dragon              │
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│       组件层 (JS Component)          │
│  - components/fund-card/            │
│  - components/emotion-gauge/        │
│  - components/metric-card/          │
│  - components/dragon-card/           │
│  - components/status-bar/           │
│  - components/tab-bar/               │
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│       数据层 (JS)                    │
│  - utils/mock.js                    │
│  - utils/color.js                   │
└─────────────────────────────────────┘
```

### 3.2 Mock 数据结构

```javascript
// 基金数据
interface Fund {
  code: string;          // 基金代码
  name: string;         // 基金名称
  estimateNav: number;   // 估算净值
  navDate: string;      // 净值日期
  estimateChange: number; // 估算涨跌幅
  trend: number[];       // 趋势数据
}

// 市场情绪
interface Sentiment {
  fearGreedIndex: number;   // 恐慌贪婪指数
  sentiment: string;        // 情绪标签
  upLimit: number;         // 涨停数
  downLimit: number;        // 跌停数
  burstRate: number;        // 炸板率
  yesterdayUpToday: number; // 昨日涨停今表现
  updateTime: string;       // 更新时间
}

// ETF资金流向
interface ETFFlow {
  code: string;
  name: string;
  netInflow: number;   // 净流入（亿）
  flowRate: number;     // 流入率
}

// 龙虎榜
interface DragonTiger {
  code: string;
  name: string;
  reason: string;
  institutionBuy: number;
  institutionSell: number;
  dealerBuy: number;
  dealerSell: number;
}

// 营业部排行
interface DealerRank {
  name: string;
  buyAmount: number;
  sellAmount: number;
}
```

---

## 4. 组件规格

### 4.1 StatusBar 状态栏

```javascript
Component({
  properties: {
    height: { type: Number, value: 44 }
  },
  data: {
    time: '',      // 当前时间
    battery: 85   // 电量
  }
})
```

**样式**：
- 高度：44px
- 背景：渐变透明 `linear-gradient(180deg, rgba(10, 14, 26, 0.95), rgba(10, 14, 26, 0.8))`
- 位置：fixed 固定在顶部

### 4.2 TabBar 底部导航

```javascript
Component({
  properties: {
    currentTab: { type: Number, value: 0 }
  },
  data: {
    tabs: [
      { pagePath: '/pages/fund/fund', text: '基金估值', icon: '📈' },
      { pagePath: '/pages/sentiment/sentiment', text: '情绪分析', icon: '📊' },
      { pagePath: '/pages/dragon/dragon', text: '龙虎榜', icon: '🏆' }
    ]
  }
})
```

**样式**：
- 高度：120rpx + 底部安全区
- 背景：毛玻璃效果 `backdrop-filter: blur(20px)`
- Tab项：图标 + 文字
- 激活状态：主色调高亮，不透明度1

### 4.3 FundCard 基金卡片

```javascript
Component({
  properties: {
    fund: { type: Object, value: {} }
  },
  methods: {
    onTap() { this.triggerEvent('tap', { fund: this.properties.fund }); },
    onDelete() { this.triggerEvent('delete', { code: this.properties.fund.code }); }
  }
})
```

**布局**：
```
┌─────────────────────────────────────┐
│ [基金代码]        [估算净值]  [时间]  │
│ 基金名称                            │
│ ─────────────────────────────────── │
│ [趋势迷你柱状图]                     │
│                        [+涨跌幅]     │
└─────────────────────────────────────┘
```

**样式**：
- 背景：`--bg-card`
- 圆角：12rpx
- 内边距：24rpx
- 涨绿跌红：`--success` / `--danger`

### 4.4 EmotionGauge 情绪仪表盘

```javascript
Component({
  properties: {
    value: { type: Number, value: 50 },
    label: { type: String, value: '中性' }
  },
  data: {
    rotateDeg: 0,
    sentimentColorClass: 'neutral',
    displayValue: 50,
    displayLabel: '中性'
  }
})
```

**样式**：
- 环形 SVG/CSS 实现
- 颜色：红→黄→绿渐变
- 中心显示数值和标签

### 4.5 MetricCard 指标卡片

```javascript
Component({
  properties: {
    icon: { type: String, value: '📊' },
    value: { type: [String, Number], value: 0 },
    label: { type: String, value: '' },
    color: { type: String, value: 'neutral' }
  }
})
```

**布局**：
```
┌───────────────────┐
│ [图标]            │
│ [数值]            │
│ [标签]            │
└───────────────────┘
```

### 4.6 DragonCard 龙虎榜卡片

```javascript
Component({
  properties: {
    item: { type: Object, value: {} }
  }
})
```

**布局**：
- 展开前：代码、名称、上榜原因标签
- 展开后：机构/营业部买卖数据对比

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
  
  /* 文字色 */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  /* 涨跌色 */
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  
  /* 边框 */
  --border: rgba(99, 102, 241, 0.2);
}
```

#### 字体系统
```css
/* 中文 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* 等宽字体（用于数字） */
font-family: 'JetBrains Mono', 'SF Mono', monospace;
```

#### 间距系统
```css
--space-base: 4px;
--space-lg: 16px;    /* 页面边距 */
--space-md: 12px;    /* 卡片间距 */
--space-card: 16px;  /* 卡片内边距 */
--radius-card: 12rpx; /* 卡片圆角 */
--radius-btn: 8rpx;   /* 按钮圆角 */
```

### 5.2 组件设计

#### 状态栏（StatusBar）
- 高度：44px（通过 `statusBarHeight` 动态获取）
- 背景：透明渐变
- 内容：左侧时间 + 右侧信号和电池图标
- 位置：fixed 固定在顶部

#### TabBar
- 高度：120rpx + 底部安全区
- 背景：毛玻璃效果 `backdrop-filter: blur(20px)`
- Tab项：图标 + 文字
- 指示器：底部渐变条

#### 基金卡片（FundCard）
- 背景：`--bg-card`
- 圆角：`12rpx`
- 内边距：`24rpx`
- 涨跌色：右上角涨跌幅数字
- 趋势图：CSS 柱状图

#### 情绪仪表盘（EmotionGauge）
- CSS 环形进度
- 中心数字和标签
- 颜色根据数值动态变化

#### 指标卡片（MetricCard）
- 2×2 网格布局
- 图标 + 数值 + 标签

### 5.3 动效规格

#### 页面进入动画
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.page-content {
  animation: fadeInUp 300ms ease;
}
```

#### Tab切换
```css
.tab-item {
  transition: all 200ms ease;
}
```

#### 下拉刷新
- 使用微信小程序原生 `onPullDownRefresh`
- 触发后显示成功 Toast

---

## 6. 错误处理

### 6.1 组件空值处理

所有组件在 `attached` 生命周期和 `observers` 中添加空值保护：

```javascript
// emotion-gauge.js
updateGauge() {
  const value = this.properties.value || 0;
  const label = this.properties.label || '中性';
  // ...
}

// metric-card.js
updateDisplay() {
  const value = this.properties.value;
  if (typeof value === 'number') {
    displayValue = value.toString();
  } else if (!value) {
    displayValue = '0';
  }
  // ...
}
```

### 6.2 页面数据加载

```javascript
loadData() {
  const sentimentData = mockSentiment || {
    fearGreedIndex: 50,
    sentiment: '中性',
    // ...
  };
  this.setData({ sentimentData });
}
```

---

## 7. 项目结构

```
AI_PROJ/
├── app.js                  # 应用入口
├── app.json                # 全局配置
├── app.wxss                # 全局样式
├── sitemap.json            # sitemap
├── utils/
│   ├── mock.js             # 模拟数据
│   └── color.js            # 色值管理
├── components/
│   ├── status-bar/         # 状态栏组件
│   ├── tab-bar/            # 底部导航组件
│   ├── fund-card/          # 基金卡片组件
│   ├── emotion-gauge/      # 情绪仪表盘组件
│   ├── metric-card/        # 指标卡片组件
│   └── dragon-card/        # 龙虎榜卡片组件
└── pages/
    ├── fund/               # 基金估值页面
    ├── sentiment/          # 情绪分析页面
    └── dragon/             # 龙虎榜页面
```

---

## 8. 验收标准

### 8.1 功能验收

- [x] Tab切换流畅，无明显延迟
- [x] 基金搜索可按代码/名称搜索
- [x] 自选基金可删除
- [x] 估值数据可刷新更新
- [x] 情绪仪表盘正确显示
- [x] ETF列表正确展示资金流向
- [x] 龙虎榜日期筛选功能
- [x] 龙虎榜展开/收起详情
- [x] 实力营业部排行显示

### 8.2 视觉验收

- [x] 深色科技风格主题一致
- [x] 涨跌色正确区分（绿涨红跌）
- [x] 动画流畅，无卡顿
- [x] 适配iPhone刘海屏（StatusBar）
- [x] TabBar毛玻璃效果
- [x] 页面切换淡入动画

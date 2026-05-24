# 金融数据助手 - 代码审查报告

## 审查日期
2026-05-24

## 审查范围
- 后端 Node.js 服务（/server/）
- 小程序前端代码
- 整体架构和实现

---

## 🚨 严重问题（必须修复）

### 1. **tushare.js - 没有真正调用 API！** ⚠️

**问题文件：** [server/services/tushare.js](file:///Users/zhoutianrun/Documents/AI_PROJ/server/services/tushare.js#L43-L89)

**问题描述：**
```javascript
// 所有方法都只是返回 mock 数据，完全没有调用 this.request()！
async getSentimentIndex() {
  if (!this.enabled) return mockService.getSentimentIndex();
  
  try {
    const data = mockService.getSentimentIndex();  // ❌ 直接返回 mock
    logger.info('情绪指数获取成功');
    return data;
  } catch (err) {
    return mockService.getSentimentIndex();
  }
}
```

**影响：**
- tushare API 完全没有生效
- 配置的 token 形同虚设
- 情绪指数和龙虎榜数据都是模拟的

**修复建议：**
- 实现真实的 tushare 接口调用
- 使用 `daily_basic`、`top_list`、`money_flow` 等接口
- 计算恐慌贪婪指数逻辑

---

### 2. **eastmoney.js - 搜索和 ETF 直接返回 Mock** ⚠️

**问题文件：** [server/services/eastmoney.js](file:///Users/zhoutianrun/Documents/AI_PROJ/server/services/eastmoney.js#L49-L60)

**问题描述：**
```javascript
async searchFunds(keyword) {
  try {
    return mockService.searchFunds(keyword);  // ❌ 直接返回 mock
  } catch (err) {
    logger.error(`搜索失败: ${err.message}`);
    return mockService.searchFunds(keyword);
  }
}

async getETFFlow(category = 'broad') {
  return mockService.getETFFlow(category);  // ❌ 直接返回 mock
}
```

**影响：**
- 基金搜索功能无法使用
- ETF 资金流向是模拟数据

**修复建议：**
- 实现东方财富基金搜索接口
- 实现 ETF 数据接口

---

### 3. **基金页面 - onShow 重置自选列表** ⚠️

**问题文件：** [pages/fund/fund.js](file:///Users/zhoutianrun/Documents/AI_PROJ/pages/fund/fund.js#L24-L27)

**问题描述：**
```javascript
onShow() {
  const watchList = mockFunds.slice(0, 3);  // ❌ 每次显示都重置
  this.setData({ watchList });
}
```

**影响：**
- 用户添加的自选基金，切换页面后立即丢失
- 完全没有持久化

**修复建议：**
- 从本地存储加载自选基金
- 实现自选基金的增删查改接口

---

## ⚠️ 重要问题（应该修复）

### 4. **没有真正的持久化机制**

**问题描述：**
- 自选基金只在前端内存中
- 后端没有提供管理接口
- 数据丢失风险高

**修复建议：**
```javascript
// 后端新增：自选基金管理接口
// 前端：使用 wx.setStorageSync 本地持久化
```

---

### 5. **缓存机制 - 缺少手动刷新支持**

**问题描述：**
- 缓存命中时无法强制刷新
- 用户下拉刷新可能被缓存拦截

**修复建议：**
```javascript
// 路由增加 refresh 参数
router.get('/list', async (req, res) => {
  const refresh = req.query.refresh === 'true';
  if (!refresh) {
    let data = cache.get('fund:list');
    if (data) return jsonRes(res, data, 'cache', true);
  }
  // ...
});
```

---

### 6. **错误处理不完善**

**问题文件：** [server/routes/fund.js](file:///Users/zhoutianrun/Documents/AI_PROJ/server/routes/fund.js#L30-L46)

**问题描述：**
```javascript
try {
  // ...
} catch (err) {
  logger.error('基金列表失败: ' + err.message);
  errorRes(res, '获取基金估值失败');  // ❌ 太笼统
}
```

**修复建议：**
- 提供更详细的错误信息
- 区分网络错误、解析错误、限流错误

---

## ⚙️ 一般问题（建议优化）

### 7. **后端缺少 npm dependencies**

**问题文件：** [server/package.json](file:///Users/zhoutianrun/Documents/AI_PROJ/server/package.json)

**问题描述：**
- 依赖中没有包含 `express-rate-limit`、`cors`
- 缺少 `chalk`（logger.js 中使用）

**修复建议：**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0",
    "chalk": "^4.1.2"
  }
}
```

---

### 8. **前端数据加载状态管理**

**问题描述：**
- 缺少统一的 loading 状态
- 错误提示不够友好

**修复建议：**
- 增加全局 loading 状态
- 错误时提供重试按钮

---

### 9. **缺少测试和日志**

**问题描述：**
- 没有单元测试
- 没有集成测试
- 日志级别不够细致

**修复建议：**
- 增加 Jest 测试
- 完善日志系统

---

## ✅ 做得好的地方

1. **架构清晰** - 分层合理，路由 / 服务 / 工具职责分明
2. **双缓存机制** - 内存 + 文件缓存，性能考虑周全
3. **降级策略** - API 失败时有 mock 数据兜底
4. **限流保护** - 有 rate-limit 防止滥用
5. **环境配置** - 使用 dotenv 管理配置

---

## 📋 修复优先级

| 优先级 | 问题 | 预估工时 |
|--------|------|----------|
| P0 | tushare.js 真实 API 调用 | 3小时 |
| P0 | 基金页面 onShow 问题 | 1小时 |
| P1 | eastmoney.js 搜索和 ETF | 2小时 |
| P1 | 自选基金持久化 | 2小时 |
| P2 | 完善错误处理 | 1小时 |
| P2 | 补充依赖包 | 0.5小时 |

---

## 🎯 总结

**整体评价：** 架构设计良好，但实现有遗漏，核心功能未完成

**通过率：** ~65%（需要修复关键问题）

**建议：**
1. 优先修复 P0 问题
2. 补充测试用例
3. 完善文档和注释
4. 进行端到端测试

---

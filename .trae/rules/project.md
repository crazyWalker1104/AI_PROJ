# 项目结构规则
## 技术栈
- 平台：微信小程序
- 语言：WXML / WXSS / JavaScript / JSON
- 数据：本地 Mock 数据
- 图表：使用小程序原生 Canvas 实现趋势图、仪表盘、柱状图

## 固定目录结构
pages/
  index/           主页（底部Tab容器）
    fund/          基金估值
    sentiment/     A股情绪
    dragon/        龙虎榜
components/        公共组件
  fund-card/       基金卡片
  metric-card/     数据指标卡片
  emotion-gauge/   情绪仪表盘
  dragon-card/     龙虎榜卡片
utils/             工具类
  mock.js          模拟数据
  color.js         色值统一管理
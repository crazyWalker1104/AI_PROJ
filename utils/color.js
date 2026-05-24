// utils/color.js
// 色值统一管理

const colors = {
  bgPrimary: '#0a0e1a',
  bgSecondary: '#111827',
  bgCard: '#1a2332',
  bgCardHover: '#232f42',
  accentPrimary: '#6366f1',
  accentSecondary: '#8b5cf6',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  border: 'rgba(99, 102, 241, 0.2)'
};

// 获取情绪颜色
function getSentimentColor(index) {
  if (index <= 20) return '#ef4444'; // 极度恐慌-红
  if (index <= 40) return '#f59e0b'; // 恐慌-橙
  if (index <= 60) return '#eab308'; // 中性-黄
  if (index <= 80) return '#22c55e'; // 贪婪-浅绿
  return '#10b981'; // 极度贪婪-绿
}

// 获取情绪标签
function getSentimentLabel(index) {
  if (index <= 20) return '极度恐慌';
  if (index <= 40) return '恐慌';
  if (index <= 60) return '中性';
  if (index <= 80) return '贪婪';
  return '极度贪婪';
}

// 获取涨跌颜色
function getChangeColor(change) {
  return change >= 0 ? colors.success : colors.danger;
}

module.exports = {
  colors,
  getSentimentColor,
  getSentimentLabel,
  getChangeColor
};

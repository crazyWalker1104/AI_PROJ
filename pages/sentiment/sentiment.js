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
    Promise.all([this.loadSentimentData(true), this.loadETFData(true)]).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadSentimentData(refresh = false) {
    try {
      const indexRes = await api.getSentimentIndex(refresh);
      const metricsRes = await api.getMarketMetrics(refresh);
      this.setData({
        sentimentIndex: indexRes.data.fearGreedIndex,
        sentiment: indexRes.data.sentiment,
        ...metricsRes.data
      });
    } catch (err) {
      console.error('加载情绪数据失败:', err);
    }
  },

  async loadETFData(refresh = false) {
    try {
      const res = await api.getETFFlow(this.data.etfCategory, refresh);
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

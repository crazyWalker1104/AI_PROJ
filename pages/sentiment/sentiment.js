// pages/sentiment/sentiment.js
const { mockSentiment, mockETFs } = require('../../utils/mock.js');

Page({
  data: {
    statusBarHeight: 44,
    currentTab: 1,
    sentimentData: {
      fearGreedIndex: 0,
      sentiment: '中性',
      upLimit: 0,
      downLimit: 0,
      burstRate: 0,
      yesterdayUpToday: 0,
      updateTime: ''
    },
    etfCategory: 'broad',
    etfList: []
  },

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadData();
  },

  onPullDownRefresh() {
    setTimeout(() => {
      this.loadData();
      wx.showToast({ title: '刷新成功', icon: 'success' });
      wx.stopPullDownRefresh();
    }, 1000);
  },

  loadData() {
    const sentimentData = mockSentiment || {
      fearGreedIndex: 50,
      sentiment: '中性',
      upLimit: 0,
      downLimit: 0,
      burstRate: 0,
      yesterdayUpToday: 0,
      updateTime: ''
    };
    const etfList = mockETFs && mockETFs[this.data.etfCategory] ? mockETFs[this.data.etfCategory] : [];

    this.setData({
      sentimentData,
      etfList
    });
  },

  onSwitchETF(e) {
    const category = e.currentTarget.dataset.category;
    const etfList = mockETFs && mockETFs[category] ? mockETFs[category] : [];
    this.setData({
      etfCategory: category,
      etfList
    });
  }
});

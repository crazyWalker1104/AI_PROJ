// pages/sentiment/sentiment.js
const { mockSentiment, mockETFs } = require('../../utils/mock.js');

Page({
  data: {
    statusBarHeight: 44,
    currentTab: 1,
    sentimentData: {},
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
    const sentimentData = mockSentiment;
    const etfList = mockETFs[this.data.etfCategory] || [];

    this.setData({
      sentimentData,
      etfList
    });
  },

  onSwitchETF(e) {
    const category = e.currentTarget.dataset.category;
    const etfList = mockETFs[category] || [];
    this.setData({
      etfCategory: category,
      etfList
    });
  }
});

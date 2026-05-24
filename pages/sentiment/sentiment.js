// pages/sentiment/sentiment.js
const { mockSentiment, mockETFs } = require('../../utils/mock.js');

Page({
  data: {
    sentimentData: {},
    etfCategory: 'broad',
    etfList: []
  },

  onLoad() {
    this.loadData();
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

// pages/dragon/dragon.js
const { mockDragonList, mockDealerRanking } = require('../../utils/mock.js');

Page({
  data: {
    statusBarHeight: 44,
    currentTab: 2,
    selectedDate: '2024-01-15',
    dragonList: [],
    dealerRanking: []
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
    this.setData({
      dragonList: mockDragonList || [],
      dealerRanking: mockDealerRanking || []
    });
  },

  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value
    });
    wx.showToast({ title: `已选择 ${e.detail.value}`, icon: 'none' });
  },

  onDragonExpand(e) {
    const code = e.detail && e.detail.code;
    if (!code) return;
    
    const dragonList = this.data.dragonList.map(item => {
      if (item.code === code) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.setData({ dragonList });
  }
});

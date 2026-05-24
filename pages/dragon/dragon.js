// pages/dragon/dragon.js
const { mockDragonList, mockDealerRanking } = require('../../utils/mock.js');

Page({
  data: {
    selectedDate: '2024-01-15',
    dragonList: [],
    dealerRanking: []
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    this.setData({
      dragonList: mockDragonList,
      dealerRanking: mockDealerRanking
    });
  },

  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value
    });
    wx.showToast({ title: `已选择 ${e.detail.value}`, icon: 'none' });
  },

  onDragonExpand(e) {
    const code = e.detail.code;
    const dragonList = this.data.dragonList.map(item => {
      if (item.code === code) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.setData({ dragonList });
  }
});

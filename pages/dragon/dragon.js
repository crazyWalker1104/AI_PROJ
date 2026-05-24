const api = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 44,
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
    this.loadData(true).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadData(refresh = false) {
    try {
      const listRes = await api.getDragonList(refresh);
      const dealerRes = await api.getDealerRanking(refresh);
      this.setData({
        dragonList: listRes.data,
        dealerRanking: dealerRes.data
      });
    } catch (err) {
      console.error('加载龙虎榜数据失败:', err);
    }
  }
});

// pages/fund/fund.js
const { mockFunds } = require('../../utils/mock.js');

Page({
  data: {
    statusBarHeight: 44,
    currentTab: 0,
    watchList: [],
    rankingType: 'rise',
    rankingList: [],
    searchKeyword: ''
  },

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadData();
  },

  onShow() {
    // 模拟已添加的自选基金
    const watchList = mockFunds.slice(0, 3);
    this.setData({ watchList });
  },

  onPullDownRefresh() {
    // 模拟刷新数据
    setTimeout(() => {
      this.loadData();
      const watchList = mockFunds.slice(0, 3);
      this.setData({ watchList });
      wx.showToast({ title: '刷新成功', icon: 'success' });
      wx.stopPullDownRefresh();
    }, 1000);
  },

  loadData() {
    const rankingList = this.data.rankingType === 'rise'
      ? [...mockFunds].sort((a, b) => b.estimateChange - a.estimateChange)
      : [...mockFunds].sort((a, b) => a.estimateChange - b.estimateChange);

    this.setData({ rankingList });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchFund() {
    const keyword = this.data.searchKeyword;
    if (!keyword) {
      this.loadData();
      return;
    }

    const filtered = mockFunds.filter(fund => 
      fund.code.includes(keyword) || fund.name.includes(keyword)
    );

    this.setData({ rankingList: filtered });
  },

  onSwitchRanking(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ rankingType: type });
    this.loadData();
  },

  onFundTap(e) {
    const fund = e.detail && e.detail.fund;
    if (fund && fund.name) {
      wx.showToast({ title: `查看 ${fund.name}`, icon: 'none' });
    }
  },

  onDeleteFund(e) {
    const code = e.currentTarget.dataset.code;
    const watchList = this.data.watchList.filter(f => f.code !== code);
    this.setData({ watchList });
    wx.showToast({ title: '已删除', icon: 'success' });
  }
});

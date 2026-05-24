// pages/fund/fund.js
const { mockFunds } = require('../../utils/mock.js');

Page({
  data: {
    watchList: [],
    rankingType: 'rise',
    rankingList: [],
    searchKeyword: ''
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 模拟已添加的自选基金
    const watchList = mockFunds.slice(0, 3);
    this.setData({ watchList });
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
  }
});

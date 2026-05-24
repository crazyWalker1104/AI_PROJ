const api = require('../../utils/api.js');
const { mockFunds } = require('../../utils/mock.js');

Page({
  data: {
    statusBarHeight: 44,
    currentTab: 0,
    watchList: [],
    rankingType: 'rise',
    rankingList: [],
    searchKeyword: '',
    isSearching: false,
    searchResults: []
  },

  onLoad() {
    const app = getApp();
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 44
    });
    this.loadWatchList(); // 先加载自选列表
    this.loadData();
  },

  onShow() {
    // 从本地存储加载自选基金，不重置
    this.loadWatchList();
  },

  // 从本地存储加载自选基金
  loadWatchList() {
    try {
      const watchList = wx.getStorageSync('watchList') || [];
      if (watchList.length > 0) {
        this.setData({ watchList });
      }
    } catch (err) {
      console.error('加载自选失败:', err);
    }
  },

  // 保存自选基金到本地存储
  saveWatchList() {
    try {
      wx.setStorageSync('watchList', this.data.watchList);
    } catch (err) {
      console.error('保存自选失败:', err);
    }
  },

  onPullDownRefresh() {
    wx.showLoading({ title: '刷新中...' });
    this.loadData().then(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  },

  async loadData() {
    try {
      const res = await api.getFundList();
      const rankingList = this.data.rankingType === 'rise' ? 
        [...res.data].sort((a, b) => b.estimateChange - a.estimateChange) :
        [...res.data].sort((a, b) => a.estimateChange - b.estimateChange);
      this.setData({ rankingList });
    } catch (err) {
      console.error('加载数据失败:', err);
    }
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
  },

  async onSearchFund() {
    const keyword = this.data.searchKeyword;
    if (!keyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }
    try {
      wx.showLoading({ title: '搜索中...' });
      const res = await api.searchFund(keyword);
      this.setData({ isSearching: true, searchResults: res.data });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
    }
  },

  onSwitchRanking(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ rankingType: type, isSearching: false, searchResults: [] });
    this.loadData();
  },

  onFundTap(e) {
    const fund = e.detail && e.detail.fund;
    if (fund) wx.showToast({ title: `查看 ${fund.name}`, icon: 'none' });
  },

  onAddToWatchlist(e) {
    const fund = e.currentTarget.dataset.fund;
    if (!fund) return;

    const exists = this.data.watchList.some(f => f.code === fund.code);
    if (exists) {
      wx.showToast({ title: '已在自选中', icon: 'none' });
      return;
    }

    const watchList = [...this.data.watchList, fund];
    this.setData({ watchList });
    this.saveWatchList(); // 持久化保存
    wx.showToast({ title: '已添加到自选', icon: 'success' });
  },

  onDeleteFund(e) {
    const code = e.currentTarget.dataset.code;
    const watchList = this.data.watchList.filter(f => f.code !== code);
    this.setData({ watchList });
    this.saveWatchList(); // 持久化保存
    wx.showToast({ title: '已删除', icon: 'success' });
  }
});

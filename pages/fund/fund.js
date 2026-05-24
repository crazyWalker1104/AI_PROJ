// pages/fund/fund.js
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
    this.loadData();
  },

  onShow() {
    // 模拟已添加的自选基金
    const watchList = mockFunds.slice(0, 3);
    this.setData({ watchList });
  },

  onPullDownRefresh() {
    setTimeout(() => {
      this.loadData();
      const watchList = mockFunds.slice(0, 3);
      this.setData({ watchList, isSearching: false, searchResults: [] });
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
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    if (keyword) {
      const results = mockFunds.filter(fund => 
        fund.code.toLowerCase().includes(keyword.toLowerCase()) || 
        fund.name.toLowerCase().includes(keyword.toLowerCase())
      );
      this.setData({ 
        isSearching: true, 
        searchResults: results 
      });
    } else {
      this.setData({ 
        isSearching: false, 
        searchResults: [] 
      });
    }
  },

  onSearchFund() {
    const keyword = this.data.searchKeyword;
    if (!keyword) {
      wx.showToast({ title: '请输入基金代码或名称', icon: 'none' });
      return;
    }
    
    const results = mockFunds.filter(fund => 
      fund.code.toLowerCase().includes(keyword.toLowerCase()) || 
      fund.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (results.length > 0) {
      this.setData({ 
        isSearching: true, 
        searchResults: results 
      });
      wx.showToast({ title: `找到${results.length}个结果`, icon: 'success' });
    } else {
      wx.showToast({ title: '未找到相关基金', icon: 'none' });
    }
  },

  onSwitchRanking(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ rankingType: type, isSearching: false, searchResults: [] });
    this.loadData();
  },

  onFundTap(e) {
    const fund = e.detail && e.detail.fund;
    if (fund && fund.name) {
      wx.showToast({ title: `查看 ${fund.name}`, icon: 'none' });
    }
  },

  onAddToWatchlist(e) {
    const fund = e.currentTarget.dataset.fund;
    if (!fund) return;

    const watchList = this.data.watchList;
    const exists = watchList.some(f => f.code === fund.code);

    if (exists) {
      wx.showToast({ title: '已在自选中', icon: 'none' });
      return;
    }

    watchList.push(fund);
    this.setData({ watchList });

    // 更新搜索结果中该基金的状态
    const searchResults = this.data.searchResults.map(item => {
      if (item.code === fund.code) {
        return { ...item, isAdded: true };
      }
      return item;
    });
    this.setData({ searchResults });

    wx.showToast({ title: '已添加到自选', icon: 'success' });
  },

  onDeleteFund(e) {
    const code = e.currentTarget.dataset.code;
    const watchList = this.data.watchList.filter(f => f.code !== code);
    this.setData({ watchList });
    wx.showToast({ title: '已删除', icon: 'success' });
  }
});

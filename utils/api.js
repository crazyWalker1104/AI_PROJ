const BASE_URL = 'http://localhost:3000/api';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data,
      success: (res) => {
        if (res.data.success) {
          if (res.data.fromCache) {
            console.log('[API] 数据来自缓存:', url);
          }
          resolve(res.data);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = {
  getFundList: () => request('/fund/list'),
  searchFund: (keyword) => request('/fund/search', { data: { keyword } }),
  getSentimentIndex: () => request('/sentiment/index'),
  getMarketMetrics: () => request('/sentiment/market'),
  getETFFlow: (category) => request('/etf/flow', { data: { category } }),
  getDragonList: () => request('/dragon/list'),
  getDealerRanking: () => request('/dragon/dealers')
};

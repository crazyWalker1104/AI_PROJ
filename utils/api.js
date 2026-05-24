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
  getFundList: (refresh = false) => request('/fund/list', { data: { refresh } }),
  searchFund: (keyword) => request('/fund/search', { data: { keyword } }),
  getSentimentIndex: (refresh = false) => request('/sentiment/index', { data: { refresh } }),
  getSentiment: (refresh = false) => request('/sentiment', { data: { refresh } }),
  getMarketMetrics: (refresh = false) => request('/sentiment/market', { data: { refresh } }),
  getETFFlow: (category, refresh = false) => request('/etf/flow', { data: { category, refresh } }),
  getDragonList: (refresh = false) => request('/dragon/list', { data: { refresh } }),
  getDealerRanking: (refresh = false) => request('/dragon/dealers', { data: { refresh } })
};

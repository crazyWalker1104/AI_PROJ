// components/tab-bar/tab-bar.js
Component({
  properties: {
    currentTab: {
      type: Number,
      value: 0
    }
  },

  data: {
    tabs: [
      { pagePath: '/pages/fund/fund', text: '基金估值', icon: '📈' },
      { pagePath: '/pages/sentiment/sentiment', text: '情绪分析', icon: '📊' },
      { pagePath: '/pages/dragon/dragon', text: '龙虎榜', icon: '🏆' }
    ]
  },

  methods: {
    onTabTap(e) {
      const { index, path } = e.currentTarget.dataset;
      if (index !== this.data.currentTab) {
        wx.redirectTo({ url: path });
      }
    }
  }
});

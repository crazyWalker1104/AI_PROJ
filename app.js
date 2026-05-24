// app.js
App({
  globalData: {
    statusBarHeight: 44
  },
  onLaunch() {
    // 获取系统信息
    const sysInfo = wx.getSystemInfoSync();
    this.globalData.statusBarHeight = sysInfo.statusBarHeight || 44;
  }
});

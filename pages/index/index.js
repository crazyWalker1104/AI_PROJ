// pages/index/index.js
Page({
  data: {
    currentTime: ''
  },

  onLoad() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 60000);
  },

  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  }
});

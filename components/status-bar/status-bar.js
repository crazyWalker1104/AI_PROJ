// components/status-bar/status-bar.js
Component({
  properties: {
    height: {
      type: Number,
      value: 44
    }
  },

  data: {
    time: '',
    battery: 85
  },

  lifetimes: {
    attached() {
      this.updateTime();
      setInterval(() => {
        this.updateTime();
      }, 60000);
    }
  },

  methods: {
    updateTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.setData({
        time: `${hours}:${minutes}`
      });
    }
  }
});

// components/emotion-gauge/emotion-gauge.js
Component({
  properties: {
    value: {
      type: Number,
      value: 50
    },
    label: {
      type: String,
      value: '中性'
    }
  },

  data: {
    rotateDeg: 0,
    sentimentColorClass: 'neutral'
  },

  lifetimes: {
    attached() {
      this.updateGauge();
    }
  },

  observers: {
    value() {
      this.updateGauge();
    }
  },

  methods: {
    updateGauge() {
      const val = this.properties.value;
      const rotate = (val / 100) * 360 - 90;
      let colorClass = 'neutral';

      if (val <= 20) colorClass = 'fear';
      else if (val <= 40) colorClass = 'neutral-fear';
      else if (val <= 60) colorClass = 'neutral';
      else if (val <= 80) colorClass = 'greed';
      else colorClass = 'extreme-greed';

      this.setData({
        rotateDeg: rotate,
        sentimentColorClass: colorClass
      });
    }
  }
});

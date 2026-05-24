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
    sentimentColorClass: 'neutral',
    displayValue: 50,
    displayLabel: '中性'
  },

  lifetimes: {
    attached() {
      this.updateGauge();
    }
  },

  observers: {
    'value, label': function() {
      this.updateGauge();
    }
  },

  methods: {
    updateGauge() {
      const value = this.properties.value || 0;
      const label = this.properties.label || '中性';
      
      // 计算旋转角度 (0-100 -> -135到135度)
      const rotateDeg = (value / 100) * 270 - 135;
      
      // 确定颜色类
      let sentimentColorClass = 'neutral';
      if (value < 30) {
        sentimentColorClass = 'fear';
      } else if (value > 70) {
        sentimentColorClass = 'greed';
      }
      
      this.setData({
        rotateDeg,
        sentimentColorClass,
        displayValue: value,
        displayLabel: label
      });
    }
  }
});

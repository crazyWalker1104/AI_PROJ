// components/metric-card/metric-card.js
Component({
  properties: {
    icon: {
      type: String,
      value: '📊'
    },
    value: {
      type: [String, Number],
      value: 0
    },
    label: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: 'neutral'
    }
  },

  data: {
    colorClass: 'neutral',
    displayValue: '0'
  },

  observers: {
    'value, color': function() {
      this.updateDisplay();
    }
  },

  lifetimes: {
    attached() {
      this.updateDisplay();
    }
  },

  methods: {
    updateDisplay() {
      const value = this.properties.value;
      const color = this.properties.color || 'neutral';
      
      let displayValue = value;
      if (typeof value === 'number') {
        displayValue = value.toString();
      } else if (!value) {
        displayValue = '0';
      }
      
      this.setData({
        displayValue,
        colorClass: color
      });
    }
  }
});

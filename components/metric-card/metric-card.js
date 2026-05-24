// components/metric-card/metric-card.js
Component({
  properties: {
    icon: {
      type: String,
      value: '📊'
    },
    value: {
      type: [String, Number],
      value: '0'
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
    colorClass: 'neutral'
  },

  observers: {
    color() {
      this.updateColorClass();
    }
  },

  lifetimes: {
    attached() {
      this.updateColorClass();
    }
  },

  methods: {
    updateColorClass() {
      const color = this.properties.color;
      let colorClass = 'neutral';

      if (color === 'success' || color === 'rise') colorClass = 'success';
      else if (color === 'danger' || color === 'fall') colorClass = 'danger';
      else if (color === 'warning') colorClass = 'warning';

      this.setData({ colorClass });
    }
  }
});

// components/fund-card/fund-card.js
Component({
  properties: {
    fund: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      const fund = this.properties.fund;
      if (fund && fund.code) {
        this.triggerEvent('tap', { fund });
      }
    },
    onDelete() {
      const fund = this.properties.fund;
      if (fund && fund.code) {
        this.triggerEvent('delete', { code: fund.code });
      }
    }
  }
});

// components/fund-card/fund-card.js
Component({
  properties: {
    fund: {
      type: Object,
      value: {}
    }
  },

  data: {
    expanded: false
  },

  methods: {
    onTap() {
      const fund = this.properties.fund;
      if (fund && fund.code) {
        this.setData({ expanded: !this.data.expanded });
        this.triggerEvent('tap', { fund, expanded: this.data.expanded });
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

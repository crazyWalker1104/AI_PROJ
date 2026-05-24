// components/dragon-card/dragon-card.js
Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  data: {
    reasonClass: ''
  },

  lifetimes: {
    attached() {
      this.updateReasonClass();
    }
  },

  observers: {
    'item.reasonCode': function() {
      this.updateReasonClass();
    }
  },

  methods: {
    onExpand() {
      const item = this.properties.item;
      this.triggerEvent('expand', { code: item.code });
    },

    updateReasonClass() {
      const reasonCode = this.properties.item.reasonCode || '';
      let reasonClass = '';

      if (reasonCode.includes('rise') || reasonCode.includes('exceed')) {
        reasonClass = 'rise7';
      } else if (reasonCode.includes('fall')) {
        reasonClass = 'fall7';
      } else if (reasonCode.includes('turnover')) {
        reasonClass = 'turnover20';
      }

      this.setData({ reasonClass });
    }
  }
});

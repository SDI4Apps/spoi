export const AdvancedInfopanelComponent = {
  template: require('./advanced_info.html'),
  controller: class AdvancedInfopanelComponent {
    constructor() {
      $('#advanced-info-dialog').modal('show');
    }
  },
};

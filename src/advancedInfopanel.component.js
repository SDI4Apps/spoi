export const AdvancedInfopanelComponent = {
  template: require('./advanced_info.html'),
  controller: class AdvancedInfopanelComponent {
    constructor(scope, element, attrs) {
      $('#advanced-info-dialog').modal('show');
    }
  },
};

export const AdvancedInfopanelComponent = () => {
  return {
    template: require('./advanced_info.html'),
    link: function (scope, element, attrs) {
      $('#advanced-info-dialog').modal('show');
    },
  };
};

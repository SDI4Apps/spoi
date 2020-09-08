import Overlay from 'ol/Overlay';

export const PointPopupComponent = {
  template: require('./pointpopup.html'),
  controller: class PointPopupComponent {
    constructor($scope) {
      'ngInject';
      const container = document.getElementById('popup');
      $scope.popup = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
    }
  },
};

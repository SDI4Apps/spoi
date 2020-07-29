import Overlay from 'ol/Overlay';

export const PointPopupComponent = () => {
  return {
    template: require('./pointpopup.html'),
    link: function (scope, element, attrs) {
      const container = document.getElementById('popup');
      scope.popup = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
    },
  };
};

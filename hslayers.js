'use strict';

var gitsha = '';
if (typeof require != 'undefined') {
    require.config({
        urlArgs: 'bust=' + gitsha,
        paths: {
            app: 'app',
            core: hsl_path + 'components/core/core',
            ol: 'node_modules/openlayers/dist/ol-debug',
            trip_planner: hsl_path + 'components/trip_planner/trip_planner',
            SparqlJson: hsl_path + 'components/layers/hs.source.SparqlJson'
        }
    });

    window.name = "NG_DEFER_BOOTSTRAP!";

    require(['core'], function(app) {
        require(['app'], function(app) {
            var $html = angular.element(document.getElementsByTagName('html')[0]);
            angular.element().ready(function() {
                angular.resumeBootstrap([app['name']]);
            });
        });
    });

} else {
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element().ready(function() {
        //    angular.resumeBootstrap([exports.app['name']]);
    });
}

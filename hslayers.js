'use strict';

var hsl_path = 'node_modules/hslayers-ng/';
var gitsha = '';

require.config({
    urlArgs: 'bust=' + gitsha,
    paths: {
        app: 'app',
        core: hsl_path + 'components/core/core',
        ol: 'node_modules/openlayers/dist/ol-debug',
        trip_planner: hsl_path + 'components/trip_planner/trip_planner',
        spoi_editor: hsl_path + 'examples/geosparql/spoi_editor',
        dmuploader: 'http://app.hslayers.org/rdf_upload/bower_components/dmuploader',
        danidemo: 'http://danielm.herokuapp.com/demos/dnd/js/demo.min',
        upload: hsl_path + 'examples/geosparql/upload'
    },
    shim: {
        d3: {
            exports: 'd3'
        },
        dc: {
            deps: ['d3', 'crossfilter']
        }
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

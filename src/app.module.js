'use strict';
import './geosparql.css';
import './spoiEditor/spoiEditor.module';
import './upload/upload.module';
import 'add-layers.module';
import 'datasource-selector.module';
import 'draw.module';
import 'info.module';
import 'measure.module';
import 'permalink.module';
import 'print.module';
import 'query.module';
import 'search.module';
import 'sidebar.module';
import 'toolbar.module';
import 'trip_planner';
import SparqlJson from 'hs.source.SparqlJson';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import angular from 'angular';
import {AdvancedInfopanelComponent} from './advancedInfopanel.component';
import {
  AppComponent,
  base_layer_group,
  tourist_layer_group,
  weather_layer_group,
} from './app.component';
import {PointPopupComponent} from './pointPopup.component';
import {SpoiAttributesFilter} from './spoiAttributes.filter';

angular
  .module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.layermanager',
    'hs.print',
    'hs.map',
    'hs.query',
    'hs.search',
    'hs.permalink',
    'hs.measure',
    'hs.geolocation',
    'hs.core',
    'hs.save-map',
    'hs.addLayers',
    'gettext',
    'hs.compositions',
    'hs.trip_planner',
    'spoi_editor',
    'hs.upload',
  ])
  .component('hs', AppComponent)
  .directive('hs.advancedInfopanelDirective', AdvancedInfopanelComponent)
  .directive('hs.pointPopupDirective', PointPopupComponent)
  .value('HsConfig', {
    panelsEnabled: {
      composition_browser: false,
      datasource_selector: false,
      saveMap: false,
    },
    search_provider: ['sdi4apps_openapi', 'geonames'],
    box_layers: [base_layer_group, tourist_layer_group, weather_layer_group],
    crossfilterable_layers: [
      {
        layer_ix: 2,
        attributes: ['http://gis.zcu.cz/poi#category_osm'],
      },
    ],
    default_layers: [
      new VectorLayer({
        title: 'All POIs (slow)',
        source: new SparqlJson({
          geom_attribute: '?geom',
          url:
            'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
            encodeURIComponent(
              'SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?sub. ?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false). '
            ) +
            '<extent>' +
            encodeURIComponent('	?o ?p ?s } ORDER BY ?o') +
            '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
          projection: 'EPSG:3857',
          strategy: function (extent, resolution) {
            const tmp = [extent[0], extent[1], extent[2], extent[3]];
            return [tmp];
          },
        }),
        visible: false,
        path: 'Points of interest',
      }),
    ],
    default_view: new View({
      center: [1490321.6967438285, 6400602.013496143], //Latitude longitude    to Spherical Mercator
      zoom: 14,
      units: 'm',
    }),
    infopanel_template: 'infopanel.html',
  })
  .filter('usrFrSpoiAttribs', SpoiAttributesFilter);

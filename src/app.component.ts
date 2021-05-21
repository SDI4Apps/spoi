import {Component} from '@angular/core';

import proj4 from 'proj4';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import {register} from 'ol/proj/proj4';
import {Group, Tile} from 'ol/layer';
import {OSM, TileWMS, XYZ} from 'ol/source';
import {Vector as VectorSource} from 'ol/source';
import { transform, transformExtent, get as getProjection } from 'ol/proj';
import { Icon, Style, } from 'ol/style';

import hr_mappings from './human-readable-names';

import {HsConfig, HsLanguageService} from 'hslayers-ng';
import {SparqlJson} from 'hslayers-ng';

//proj4.defs('EPSG:5514', '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=542.5,89.2,456.9,5.517,2.275,5.516,6.96 +units=m +no_defs');
//register(proj4);
//const sjtskProjection = getProjection('EPSG:5514');
const defaultLayers = [
    //Nové BASEMAPY
    new Tile({
        source: new OSM(),
        title: 'OpenStreetMap',
        base: true,
        visible: true,
        path: 'Roads',
    }),
    new Tile({
        title: 'OpenCycleMap',
        visible: false,
        base: true,
        source: new OSM({
            url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
        }),
        path: 'Roads',
    }),
    new Tile({
        title: 'MTBMap',
        visible: false,
        base: true,
        source: new OSM({
            // For some reason XYZ() does not work here
            url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
        }),
        path: 'Roads',
    }),
    new Tile({
        title: 'OwnTiles',
        visible: false,
        base: true,
        source: new OSM({
            // For some reason XYZ() does not work here
            url: 'http://ct37.sdi4apps.eu/map/{z}/{x}/{y}.png',
        }),
        path: 'Roads',
    }),

    //WEATHER
    new Tile({
        title: 'OpenWeatherMap cloud cover',
        source: new OSM({
            // For some reason XYZ() does not work here
            url:
                'http://{a-c}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=13b627424cd072290defed4216e92baa',
        }),
        visible: false,
        opacity: 0.7,
        path: 'Weather info',
    }),
    new Tile({
        title: 'OpenWeatherMap precipitation',
        source: new OSM({
            // For some reason XYZ() does not work here
            url:
                'http://{a-c}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=13b627424cd072290defed4216e92baa',
        }),
        visible: false,
        opacity: 0.7,
        path: 'Weather info',
    }),
    new Tile({
        title: 'OpenWeatherMap temperature',
        source: new OSM({
            // For some reason XYZ() does not work here
            url:
                'http://{a-c}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=13b627424cd072290defed4216e92baa',
        }),
        visible: false,
        opacity: 0.7,
        path: 'Weather info',
    })    
];

const symbols = {
    car_service: require('../img/symbolsWaze/car_service.png'),
    bank: require('../img/symbols/bank.png'),
    atm: require('../img/symbols/atm.png'),
    cafe: require('../img/symbols/cafe.png'), 
    fast_food: require('../img/symbols/fast_food.png'),
    pub: require('../img/symbols/pub.png'),
    restaurant: require('../img/symbols/restaurant.png'),
    hotel: require('../img/symbols/hotel.png'),
    supermarket: require('../img/symbols/supermarket.png'),
    information: require('../img/symbols/information.png'),
    camp_site: require('../img/symbols/camp_site.png'),
};

const styleOSM = function (feature, resolution) {
    if (
        typeof feature.get('visible') === 'undefined' ||
        feature.get('visible') == true
    ) {
        let s = feature.get('http://www.sdi4apps.eu/poi/#mainCategory');
        if (typeof s === 'undefined') {
            return;
        }
        s = s.split('#')[1];
        return [
            new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: symbols[s],
                    size: [30, 35],
                    crossOrigin: 'anonymous',
                }),
            }),
        ];
    } else {
        return [];
    }
};

function getSpoiLayers(): any[]  {

  let category: string,
    layers: any[] = [],
    categories: Array<Record<string, string>> = Array.of(hr_mappings.popular_categories); 

  for (category in hr_mappings.popular_categories) {
        layers.push(new VectorLayer({
            title: "raz dva" /*' ' + name*/,
            source: new SparqlJson({
                geom_attribute: '?geom',
                url:
                    'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
                    encodeURIComponent(
                        'SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> FROM <http://www.sdi4apps.eu/poi_changes.rdf> FROM <http://www.sdi4apps.eu/poi_categories.rdf> WHERE { ?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>  <' +
                        category +
                        '>. ?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false). '
                    ) +
                    '<extent>' +
                    encodeURIComponent('?o ?p ?s } ORDER BY ?o') +
                    '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
                updates_url:
                    'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
                    encodeURIComponent(
                        'SELECT ?o ?date ?attr ?value FROM <http://www.sdi4apps.eu/poi.rdf> FROM <http://www.sdi4apps.eu/poi_categories.rdf> FROM <http://www.sdi4apps.eu/poi_changes.rdf> WHERE { ?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <' +
                        category +
                        '>. ?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false).'
                    ) +
                    '<extent>' +
                    encodeURIComponent(
                        ' ?o <http://purl.org/dc/elements/1.1/identifier> ?id. ?c <http://www.sdi4apps.eu/poi_changes/poi_id> ?id. ?c <http://purl.org/dc/terms/1.1/created> ?date. ?c <http://www.sdi4apps.eu/poi_changes/attribute_set> ?attr_set. ?attr_set ?attr ?value } ORDER BY ?o ?date ?attr ?value'
                    ) +
                    '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
                //category_field: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                category: category,
                projection: 'EPSG:3857',
                //extend_with_attribs: spoi_editor.getFriendlyAttribs(),
            }),
            style: styleOSM,
            visible: false,
            path: 'Popular Categories',
            //maxResolution: 310,
            //category: category,
        }));
    }

    return layers;
}

function getLayers(): any[] {
  return defaultLayers.concat(getSpoiLayers());
}

let test = getLayers();

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public HsConfig: HsConfig, public hsLangService: HsLanguageService) {
    this.HsConfig.update({
      useProxy: false,
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      popUpDisplay: 'click',
      open_lm_after_comp_loaded: true,
      default_layers: getLayers(),
      componentsEnabled: {
        sidebar: true,
        toolbar: true,
        guiOverlay: true,
        drawToolbar: false,
        searchToolbar: true,
        measureToolbar: false,
        sensors: false,
        crossfilter: false,
        golocationButton: false,
        tracking: false,
        mapControls: true,
        basemapGallery: true
      },
      panelsEnabled: {
        composition_browser: false,
        datasource_selector: false,
        mobile_settings: false,
        measure: false,
        draw: false,
        print: true,
        saveMap: false,
        language: false,
        sensors: false,
        compositionLoadingProgress: true
      },
      default_view: new View({
        projection: 'EPSG:3857',
        center: transform([15.628, 49.864249], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Mercaator
        //extent: transformExtent([9.832275, 46.151428, 21.423828, 53.577070], 'EPSG:4326', 'EPSG:5514'),
        multiWorld: false,
        zoom: 9
      })
    });

    this.hsLangService.setLanguage('cs_CZ');
  }
}

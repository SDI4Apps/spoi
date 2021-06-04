import {Component} from '@angular/core';

import {Circle, Fill, Icon, Stroke, Style} from 'ol/style';
import {OSM} from 'ol/source';
import {Tile} from 'ol/layer';
import {Vector as VectorLayer} from 'ol/layer';
import {View} from 'ol';
import {transform} from 'ol/proj';

import {
  HsConfig,
  HsLanguageService,
  HsLayoutService,
  HsPanelContainerService,
  HsQueryBaseService,
  HsSidebarService,
  HsUtilsService,
  SparqlJson,
} from 'hslayers-ng';

import hr_mappings from './data/human-readable-names.json';
import i18n from './data/translations.json';
import ms from './data/map-symbols.json';
import {SpoiPrettyInfopanelComponent} from './pretty-info-panel/pretty-infopanel.component';

//proj4.defs('EPSG:5514', '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=542.5,89.2,456.9,5.517,2.275,5.516,6.96 +units=m +no_defs');
//register(proj4);
//const sjtskProjection = getProjection('EPSG:5514');

@Component({
  selector: 'spoi-app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private symbols: {[key: string]: string} = ms.mapSymbols;
  private popularCategories: {[key: string]: string} =
    hr_mappings.popular_categories;

  constructor(
    public hsConfig: HsConfig,
    public hsLangService: HsLanguageService,
    public hsLayoutService: HsLayoutService,
    public hsPanelContainerService: HsPanelContainerService,
    public hsQueryBaseService: HsQueryBaseService,
    public hsSidebarService: HsSidebarService,
    public hsUtilsService: HsUtilsService
  ) {
    this.hsConfig.update({
      useProxy: false,
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      popUpDisplay: 'hover',
      open_lm_after_comp_loaded: true,
      default_layers: [...this.getDefaultLayers(), ...this.getSpoiLayers()],
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
        basemapGallery: true,
      },
      panelsEnabled: {
        composition_browser: false,
        datasource_selector: false,
        mobile_settings: false,
        measure: false,
        draw: false,
        info: false,
        print: true,
        saveMap: false,
        language: true,
        sensors: false,
        tripPlanner: true,
      },
      default_view: new View({
        projection: 'EPSG:3857',
        center: transform([15.628, 49.864249], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Mercaator
        //extent: transformExtent([9.832275, 46.151428, 21.423828, 53.577070], 'EPSG:4326', 'EPSG:5514'),
        multiWorld: false,
        zoom: 9,
      }),
      translationOverrides: i18n,
    });
    this.initComponents();
  }

  /* PRIVATE METHODS */

  private initComponents(): void {
    this.hsSidebarService.buttons.push({
      panel: 'pretty-info',
      module: 'pretty-info',
      order: 3,
      title: () => this.hsLangService.getTranslation('INFOPANEL.info'),
      icon: 'icon-info-sign',
    });
    this.hsPanelContainerService.create(SpoiPrettyInfopanelComponent, {});
    this.hsQueryBaseService.getFeatureInfoStarted.subscribe((evt) => {
      console.log(evt);
      this.hsLayoutService.setMainPanel('pretty-info');
    });
  }

  private getCategoryStyle(category: string): Style | void {
    const symbolSrc = this.hsUtilsService.resolveEsModule(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../img/' + this.symbols[category])
    );
    //console.log(`symbolSrc: ${symbolSrc}`)
    if (symbolSrc === undefined) {
      console.warn(`No symbol found for category: ${symbolSrc}!`);
      return;
    }

    return new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: symbolSrc,
        size: [30, 35],
        crossOrigin: 'anonymous',
      }),
    });
  }

  private getDefaultLayers(): any[] {
    return [
      // BACKGROUNDS
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

      // WEATHER
      new Tile({
        title: 'OpenWeatherMap cloud cover',
        source: new OSM({
          // For some reason XYZ() does not work here
          url: 'http://{a-c}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=13b627424cd072290defed4216e92baa',
        }),
        visible: false,
        opacity: 0.7,
        path: 'Weather info',
      }),
      new Tile({
        title: 'OpenWeatherMap precipitation',
        source: new OSM({
          // For some reason XYZ() does not work here
          url: 'http://{a-c}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=13b627424cd072290defed4216e92baa',
        }),
        visible: false,
        opacity: 0.7,
        path: 'Weather info',
      }),
      new Tile({
        title: 'OpenWeatherMap temperature',
        source: new OSM({
          // For some reason XYZ() does not work here
          url: 'http://{a-c}.tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=13b627424cd072290defed4216e92baa',
        }),
        visible: false,
        opacity: 0.7,
        path: 'Weather info',
      }),
    ];
  }

  private spoiDisplayFunction(value) {
    if (value.includes('Ontology#')) {
      return value.split('#')[1];
    }
    if (value.startsWith('http')) {
      return `<a href="${value}" target="_blank">${value}</a>`;
    }
    return value;
  }

  /**
   * Loads SPOI layers from human-readable-names.json file.
   *
   * @returns An array of VectorLayers containig SPOI data reference.
   * */
  private getSpoiLayers(): VectorLayer[] {
    const popUpConfig = {
      attributes: Object.entries(hr_mappings.properties).map((entry) => {
        return {
          attribute: entry[0],
          label: entry[1],
          displayFunction: this.spoiDisplayFunction,
        };
      }),
    };
    const layers: VectorLayer[] = [];

    layers.push(
      new VectorLayer({
        title: 'All POIs (slow)',
        source: new SparqlJson({
          geom_attribute: '?geom',
          url:
            'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
            encodeURIComponent(
              `SELECT ?o ?p ?s
              FROM <http://www.sdi4apps.eu/poi.rdf> FROM <http://www.sdi4apps.eu/poi_changes.rdf> FROM <http://www.sdi4apps.eu/poi_categories.rdf>
              WHERE {?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false).`
            ) +
            '<extent>' +
            encodeURIComponent('?o ?p ?s } ORDER BY ?o') +
            '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
          projection: 'EPSG:3857',
        }),
        style: new Style({
          image: new Circle({
            fill: new Fill({
              color: 'rgba(255, 204, 102, 0.7)',
            }),
            stroke: new Stroke({
              color: 'rgb(230, 46, 0)',
              width: 1,
            }),
            radius: 5,
          }),
        }),
        visible: false,
        cluster: true,
        popUp: popUpConfig,
      })
    );

    for (const category in this.popularCategories) {
      layers.push(
        new VectorLayer({
          title: this.popularCategories[category],
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
          }),
          style: this.getCategoryStyle(category.split('#')[1]),
          visible: false,
          path: 'Popular Categories',
          popUp: popUpConfig,
        })
      );
    }

    return layers;
  }

  /* PRIVATE METHODS - END*/
}

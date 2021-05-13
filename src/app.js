'use strict';
import 'toolbar.module';
import 'print.module';
import 'query.module';
import 'search.module';
import 'measure.module';
import 'draw.module';
import 'permalink.module';
import 'info.module';
import 'datasource-selector.module';
import 'sidebar.module';
import 'add-layers.module';
import { Tile, Group, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer';
import { TileWMS, OSM, Vector } from 'ol/source';
import View from 'ol/View';
import { transform, transformExtent, get as getProjection } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import { WMTSCapabilities, WFS as WfsFormat } from 'ol/format';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Stroke, Style } from 'ol/style';

var module = angular.module('hs', [
  'hs.sidebar',
  'hs.toolbar',
  'hs.layermanager',
  'hs.map',
  'hs.query',
  'hs.search', 'hs.print', 'hs.permalink', 'hs.measure',
  'hs.legend', 'hs.core',
  'hs.datasource_selector',
  'hs.save-map',
  'hs.addLayers',
  'hs.draw',
  'gettext',
  'hs.info'
]);

module.directive('hs', ['HsConfig', 'HsCore', function (config, Core) {
  return {
    template: Core.hslayersNgTemplate,
    link: function (scope, element) {
      Core.fullScreenMap(element);
    }
  };
}]);


proj4.defs('EPSG:5514', '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=542.5,89.2,456.9,5.517,2.275,5.516,6.96 +units=m +no_defs');
register(proj4);
const sjtskProjection = getProjection('EPSG:5514');

module.value('HsConfig', {

  useProxy: true,
  default_layers: [
    // BASEMAPY
    new Tile({
      source: new TileWMS({
        url: 'https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/service.svc/get',
        params: {
          LAYERS: 'GR_ORTFOTORGB'
        }
      }),
      title: 'Ortofoto ČÚZK',
      base: true,
      visible: true,
      removable: false,
    }),

    // Správní celky a hranice
    new Tile({
      title: "Správní členění",
      source: new TileWMS({
        url: 'https://services.cuzk.cz/wms/wms.asp',
        params: {
          LAYERS: 'prehledky',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: true,
      path: 'LPIS A KN'
    }),
    new Tile({
      title: "Katastr nemovitostí",
      source: new TileWMS({
        url: 'https://services.cuzk.cz/wms/wms.asp',
        params: {
          LAYERS: 'hranice_parcel,dalsi_p_mapy,parcelni_cisla,obrazy_parcel,RST_KMD',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'LPIS A KN'
    }),
    new Tile({
      title: "DPB účinné",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_DPB_PB_OPV.fcgi',
        params: {
          LAYERS: 'DPB_UCINNE',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'LPIS A KN'
    }),
    new Tile({
      title: "Včely polygon",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_objekty.fcgi',
        params: {
          LAYERS: 'VCELY_POL',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'LPIS A KN'
    }),
    new Tile({
      title: "EVP - účinné",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_EVP_EFA.fcgi',
        params: {
          LAYERS: 'EVP',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'LPIS A KN'
    }),

    // Půda
    new Tile({
      title: "Půdní typologie (TKSP ČR)",
      source: new TileWMS({
        url: 'https://mapy.geology.cz/arcgis/services/Pudy/pudni_typy50/MapServer/WmsServer',
        params: {
          LAYERS: '0',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Půda'
    }),
    new Tile({
      title: "BPEJ aktuální",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'BPEJ_AKT',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Půda'
    }),

    // Meliorace
    new Tile({
      title: "DPB - Míra erozní ohroženosti",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_eroze.fcgi',
        params: {
          LAYERS: 'DPB_EROZE',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Meliorace'
    }),
    new Tile({
      title: "Meliorace aktuální",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'MELIORACE_AKT',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Meliorace'
    }),

    // Nitrátová směrnice
    new Tile({
      title: "Aplikační pásma dle BPEJ",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'BPEJ_AP_AKT',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Nitrátová směrnice'
    }),
    new Tile({
      title: "Výnosové hladiny aktuální dle BPEJ",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'BPEJVHLADINY_AKT',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Nitrátová směrnice'
    }),
    new Tile({
      title: "Aplikační pásma dle DPB",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'DPB_AP',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Nitrátová směrnice'
    }),
    new Tile({
      title: "Uložení hnojiv na DPB",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'DPB_ULOZENIHNOJIV',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Nitrátová směrnice'
    }),
    new Tile({
      title: "Výnosové hladiny aktuální dle DPB",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
        params: {
          LAYERS: 'DPBVHLADINY',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Nitrátová směrnice'
    }),

    // Voda
    new Tile({
      title: 'Vodní útvary povrchových vod karegorie "řeka" včetně silně ovlivněných vodních útvarů a umělých vodních útvarů: 2. plánovací cyklus',
      source: new TileWMS({
        url: 'https://heis.vuv.cz/data/webmap/wms.dll',
        params: {
          LAYERS: 'isvs_upovr',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),
    new Tile({
      title: 'Vodní útvary povrchových vod karegorie "jezero" včetně silně ovlivněných vodních útvarů a umělých vodních útvarů: 2. plánovací cyklus',
      source: new TileWMS({
        url: 'https://heis.vuv.cz/data/webmap/wms.dll',
        params: {
          LAYERS: 'isvs_upovj',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),
    new Tile({
      title: "OPVZ - vodárenské nádrže",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
        params: {
          LAYERS: 'OPVZ_OPVN',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),
    new Tile({
      title: "OPVZ - podzemní nebo povrchové",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
        params: {
          LAYERS: 'OPVZ_PODZ_POVRCH',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),
    new Tile({
      title: "Vodní útvary - buffer 25 m",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
        params: {
          LAYERS: 'VODSTVO_BUFF_25M',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),
    new Tile({
      title: "Vodní útvary - buffer 50 m",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
        params: {
          LAYERS: 'VODSTVO_BUFF_50M',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),
    new Tile({
      title: "Vodní útvary - buffer 100 m",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
        params: {
          LAYERS: 'VODSTVO_BUFF_100M',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Voda'
    }),

    // OLU
    new Tile({
      title: "Kombinovaná mapa",
      source: new TileWMS({
        url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/olu/european_openlandusemap.map&language=eng&',
        params: {
          LAYERS: 'olu_poskladany',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Open Land Use'
    }),

    // Produkční zóny
    new Tile({
      title: "Podkladová vrstva erozní ohroženosti - hranice DZES",
      source: new TileWMS({
        url: 'https://eagri.cz/public/app/wms/public_eroze.fcgi',
        params: {
          LAYERS: 'ER_OHR_VRSTVA_DZES_HRANICE',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Produkční zóny'
    }),
    new Tile({
      title: "Produkční zóny",
      source: new TileWMS({
        url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/produkcni_zony.map&',
        params: {
          LAYERS: 'p_zony',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Produkční zóny'
    }),
    new Tile({
      title: "Produkční zóny 2020",
      source: new TileWMS({
        url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/produkcni_zony.map&',
        params: {
          LAYERS: 'p_zony_2020',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Produkční zóny'
    }),
    new Tile({
      title: "LPIS - DPB",
      source: new TileWMS({
        url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/produkcni_zony.map&',
        params: {
          LAYERS: 'lpis_hranice',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Produkční zóny'
    }),

    // Vývoj vegetace
    new Tile({
      title: "Řízená klasifikace podle RVI - 2020",
      source: new TileWMS({
        url: 'https://gis.lesprojekt.cz/qgisserver/cgi-bin/qgis_mapserv.fcgi?map=/opt/RVI4S1/rvi2020_rcl_s10_c_nd.qgs&',
        params: {
          LAYERS: 'rvi2020_rcl_s10_c_nd',
          INFO_FORMAT: "text/html",
          FORMAT: "image/png; mode=8bit"
        },
        crossOrigin: null
      }),
      visible: false,
      path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2'
    }),
  ],
  sidebarClosed: false,
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
    cross_filter: false,
    tracking: false,
    feature_table: false,
    f_crossfilter: false,
    compositionLoadingProgress: true
  },

  default_view: new View({
    projection: sjtskProjection,
    center: transform([15.628, 49.864249], 'EPSG:4326', 'EPSG:5514'), //Latitude longitude    to S-JTSK
    extent: transformExtent([9.832275, 46.151428, 21.423828, 53.577070], 'EPSG:4326', 'EPSG:5514'),
    multiWorld: false,
    zoom: 9
  })
});

module.controller('Main', ['$scope', 'HsCore', 'HsAddLayersWmsAddLayerService', 'HsCompositionsParserService', 'HsConfig', 'HsLayoutService', 'HsQueryWmsService', 'HsLanguageService',
  function ($scope, Core, layerAdderService, composition_parser, config, layoutService, queryService, langService) {
    Core.singleDatasources = true;
    layoutService.panel_statuses['gallery'] = true;
    langService.setLanguage('cs_CZ');
  }
]);


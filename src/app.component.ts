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

proj4.defs('EPSG:5514', '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=542.5,89.2,456.9,5.517,2.275,5.516,6.96 +units=m +no_defs');
register(proj4);
const sjtskProjection = getProjection('EPSG:5514');
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
    }),
    // BASEMAPY
    //new Tile({
    //  source: new TileWMS({
    //    url: 'https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/service.svc/get',
    //    params: {
    //      LAYERS: 'GR_ORTFOTORGB'
    //    }
    //  }),
    //  title: 'Ortofoto ČÚZK',
    //  base: true,
    //  visible: true,
    //  removable: false,
    //  thumbnail: 'https://www.agrihub.cz/hsl-ng/img/orto.jpg'
    //}),

    // Správní celky a hranice
    //new Tile({
    //  title: "DPB účinné",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_DPB_PB_OPV.fcgi',
    //    params: {
    //      LAYERS: 'DPB_UCINNE',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'LPIS A KN'
    //}),
    //new Tile({
    //  title: "Správní členění",
    //  source: new TileWMS({
    //    url: 'https://services.cuzk.cz/wms/wms.asp',
    //    params: {
    //      LAYERS: 'prehledky',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: true,
    //  path: 'LPIS A KN'
    //}),
    //new Tile({
    //  title: "Katastr nemovitostí",
    //  source: new TileWMS({
    //    url: 'https://services.cuzk.cz/wms/wms.asp',
    //    params: {
    //      LAYERS: 'hranice_parcel,dalsi_p_mapy,parcelni_cisla,obrazy_parcel,RST_KMD',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'LPIS A KN'
    //}),
    //new Tile({
    //  title: "Včely polygon",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_objekty.fcgi',
    //    params: {
    //      LAYERS: 'VCELY_POL',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'LPIS A KN'
    //}),
    //new Tile({
    //  title: "EVP - účinné",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_EVP_EFA.fcgi',
    //    params: {
    //      LAYERS: 'EVP',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'LPIS A KN'
    //}),

    //// Půda
    //new Tile({
    //  title: "Půdní typologie (TKSP ČR)",
    //  source: new TileWMS({
    //    url: 'https://mapy.geology.cz/arcgis/services/Pudy/pudni_typy50/MapServer/WmsServer',
    //    params: {
    //      LAYERS: '0',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Půda'
    //}),
    //new Tile({
    //  title: "BPEJ aktuální",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'BPEJ_AKT',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Půda'
    //}),

    //// Meliorace
    //new Tile({
    //  title: "DPB - Míra erozní ohroženosti",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_eroze.fcgi',
    //    params: {
    //      LAYERS: 'DPB_EROZE',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Meliorace'
    //}),
    //new Tile({
    //  title: "Meliorace aktuální",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'MELIORACE_AKT',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Meliorace'
    //}),

    //// Nitrátová směrnice
    //new Tile({
    //  title: "Aplikační pásma dle BPEJ",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'BPEJ_AP_AKT',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Nitrátová směrnice'
    //}),
    //new Tile({
    //  title: "Výnosové hladiny aktuální dle BPEJ",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'BPEJVHLADINY_AKT',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Nitrátová směrnice'
    //}),
    //new Tile({
    //  title: "Aplikační pásma dle DPB",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'DPB_AP',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Nitrátová směrnice'
    //}),
    //new Tile({
    //  title: "Uložení hnojiv na DPB",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'DPB_ULOZENIHNOJIV',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Nitrátová směrnice'
    //}),
    //new Tile({
    //  title: "Výnosové hladiny aktuální dle DPB",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_ns.fcgi',
    //    params: {
    //      LAYERS: 'DPBVHLADINY',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Nitrátová směrnice'
    //}),

    //// Voda
    //new Tile({
    //  title: 'Vodní útvary povrchových vod karegorie "řeka" včetně silně ovlivněných vodních útvarů a umělých vodních útvarů: 2. plánovací cyklus',
    //  source: new TileWMS({
    //    url: 'https://heis.vuv.cz/data/webmap/wms.dll',
    //    params: {
    //      LAYERS: 'isvs_upovr',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),
    //new Tile({
    //  title: 'Vodní útvary povrchových vod karegorie "jezero" včetně silně ovlivněných vodních útvarů a umělých vodních útvarů: 2. plánovací cyklus',
    //  source: new TileWMS({
    //    url: 'https://heis.vuv.cz/data/webmap/wms.dll',
    //    params: {
    //      LAYERS: 'isvs_upovj',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),
    //new Tile({
    //  title: "OPVZ - vodárenské nádrže",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
    //    params: {
    //      LAYERS: 'OPVZ_OPVN',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),
    //new Tile({
    //  title: "OPVZ - podzemní nebo povrchové",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
    //    params: {
    //      LAYERS: 'OPVZ_PODZ_POVRCH',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),
    //new Tile({
    //  title: "Vodní útvary - buffer 25 m",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
    //    params: {
    //      LAYERS: 'VODSTVO_BUFF_25M',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),
    //new Tile({
    //  title: "Vodní útvary - buffer 50 m",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
    //    params: {
    //      LAYERS: 'VODSTVO_BUFF_50M',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),
    //new Tile({
    //  title: "Vodní útvary - buffer 100 m",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_zp.fcgi',
    //    params: {
    //      LAYERS: 'VODSTVO_BUFF_100M',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Voda'
    //}),

    //// OLU
    //new Tile({
    //  title: "Kombinovaná mapa",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/olu/european_openlandusemap.map&language=eng&',
    //    params: {
    //      LAYERS: 'olu_poskladany',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Open Land Use'
    //}),

    //// Produkční zóny
    //new Tile({
    //  title: "Podkladová vrstva erozní ohroženosti - hranice DZES",
    //  source: new TileWMS({
    //    url: 'https://eagri.cz/public/app/wms/public_eroze.fcgi',
    //    params: {
    //      LAYERS: 'ER_OHR_VRSTVA_DZES_HRANICE',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Produkční zóny'
    //}),
    //new Tile({
    //  title: "Produkční zóny",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/produkcni_zony.map&',
    //    params: {
    //      LAYERS: 'p_zony',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Produkční zóny'
    //}),
    //new Tile({
    //  title: "Produkční zóny 2020",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/produkcni_zony.map&',
    //    params: {
    //      LAYERS: 'p_zony_2020',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Produkční zóny'
    //}),
    //new Tile({
    //  title: "LPIS - DPB",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/produkcni_zony.map&',
    //    params: {
    //      LAYERS: 'lpis_hranice',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Produkční zóny'
    //}),

    //// Vývoj vegetace
    //new Tile({
    //  title: "Řízená klasifikace podle RVI - 2020",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/qgisserver/cgi-bin/qgis_mapserv.fcgi?map=/opt/RVI4S1/rvi2020_rcl_s10_c_nd.qgs&',
    //    params: {
    //      LAYERS: 'rvi2020_rcl_s10_c_nd',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2'
    //}),
    //new Tile({
    //  title: "RVI4S1 index",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/geoserver/Agrihub/wms',
    //    params: {
    //      LAYERS: 'RVI4S1',
    //      INFO_FORMAT: 'text/html',
    //      FORMAT: 'image/png',
    //    },
    //    crossOrigin: null,
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2',
    //  dimensions: {
    //    time: {
    //      value: '2018-04-14',
    //      type: 'datetime',
    //      format: 'YYYY-MM-DD'
    //    }
    //  },
    //}),
    //new Tile({
    //  title: "RVI4S1 rozdíl za 6 dní",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/geoserver/Agrihub/wms',
    //    params: {
    //      LAYERS: 'rozdily6dni',
    //      INFO_FORMAT: 'text/html',
    //      FORMAT: 'image/png',
    //    },
    //    crossOrigin: null,
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2',
    //  dimensions: {
    //    time: {
    //      value: '2018-04-20',
    //      type: 'datetime',
    //      format: 'YYYY-MM-DD'
    //    }
    //  },
    //}),
    //new Tile({
    //  title: "RVI4S1 leden 2021",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/geoserver/Agrihub/wms',
    //    params: {
    //      LAYERS: 'RVI4S1_2021_01',
    //      INFO_FORMAT: 'text/html',
    //      FORMAT: 'image/png',
    //    },
    //    crossOrigin: null,
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2',
    //  dimensions: {
    //    time: {
    //      value: '2021-01-03',
    //      type: 'datetime',
    //      format: 'YYYY-MM-DD'
    //    }
    //  },
    //}),
    //new Tile({
    //  title: "EVI index",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/geoserver/UTM/wms',
    //    params: {
    //      LAYERS: 'evi',
    //      INFO_FORMAT: 'text/html',
    //      FORMAT: 'image/png',
    //    },
    //    crossOrigin: null,
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2',
    //  dimensions: {
    //    time: {
    //      value: '2018-07-05',
    //      type: 'datetime',
    //      format: 'YYYY-MM-DD'
    //    }
    //  },
    //}),
    //new Tile({
    //  title: "EVI index difference",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/geoserver/UTM/wms',
    //    params: {
    //      LAYERS: 'evi_diff',
    //      INFO_FORMAT: 'text/html',
    //      FORMAT: 'image/png',
    //    },
    //    crossOrigin: null,
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2',
    //  dimensions: {
    //    time: {
    //      value: '2018-03-22',
    //      type: 'datetime',
    //      format: 'YYYY-MM-DD'
    //    }
    //  },
    //}),
    //new Tile({
    //  title: "RVI4S1 KMeans 10-2020",
    //  source: new TileWMS({
    //    url: 'https://gis.lesprojekt.cz/qgisserver?MAP=/opt/RVI4S1/RVI4S1_KMeans_10_2020.qgs',
    //    params: {
    //      LAYERS: 'RVI4S1_KMeans_10_2020',
    //      INFO_FORMAT: "text/html",
    //      FORMAT: "image/png; mode=8bit"
    //    },
    //    crossOrigin: null
    //  }),
    //  visible: false,
    //  path: 'Vývoj vegetace ze Sentinel-1 a Sentinel-2',
    //}),
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

var spoiLayers = () => {
    let category, layers = [];
    for (category in hr_mappings.popular_categories) {
        layers.push(new VectorLayer({
            title: ' ' + name,
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
            maxResolution: 310,
            category: category,
        }));
    }

    return layers;
}

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
        default_layers: defaultLayers.concat(spoiLayers()),
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
        projection: sjtskProjection,
        center: transform([15.628, 49.864249], 'EPSG:4326', 'EPSG:5514'), //Latitude longitude    to S-JTSK
        extent: transformExtent([9.832275, 46.151428, 21.423828, 53.577070], 'EPSG:4326', 'EPSG:5514'),
        multiWorld: false,
        zoom: 9
      })
    });

    this.hsLangService.setLanguage('cs_CZ');
  }
}

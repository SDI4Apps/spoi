'use strict';
import './geosparql.css';
import 'hslayers-ng/components/add-layers/add-layers.module';
import 'hslayers-ng/components/datasource-selector/datasource-selector.module';
import 'hslayers-ng/components/draw/draw.module';
import 'hslayers-ng/components/info/info.module';
import 'hslayers-ng/components/measure/measure.module';
import 'hslayers-ng/components/permalink/permalink.module';
import 'hslayers-ng/components/print/print.module';
import 'hslayers-ng/components/query/query.module';
import 'hslayers-ng/components/search/search.module';
import 'hslayers-ng/components/sidebar/sidebar.module';
import 'hslayers-ng/components/toolbar/toolbar.module';
import 'hslayers-ng/components/trip_planner/trip_planner';
import * as angular from 'angular';

import {AdvancedInfopanelComponent} from './advancedInfopanel.component';
import {AppComponent} from './app.component';
import {AppConfig} from './app.config';
import {PointPopupComponent} from './pointPopup.component';
import {SpoiAttributesFilter} from './spoiAttributes.filter';
import {SpoiEditorModule} from './spoiEditor/spoiEditor.module';
import {SpoiService} from './app.service';
import {UploadModule} from './upload/upload.module';

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
    SpoiEditorModule,
    UploadModule,
  ])
  .component('hs', AppComponent)
  .component('hs.advancedInfopanelDirective', AdvancedInfopanelComponent)
  .component('hs.pointPopupDirective', PointPopupComponent)
  .value('HsConfig', AppConfig)
  .service('SpoiService', SpoiService)
  .filter('usrFrSpoiAttribs', SpoiAttributesFilter);

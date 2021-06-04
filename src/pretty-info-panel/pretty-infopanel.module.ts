import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {HsPanelHelpersModule} from 'hslayers-ng';
import {SpoiPrettyInfopanelFeatureComponent} from './pretty-infopanel-feature.component';

import {SpoiPrettyInfopanelComponent} from './pretty-infopanel.component';
import {SpoiPrettyInfopanelService} from './pretty-infopanel.service';

@NgModule({
  imports: [CommonModule, HsPanelHelpersModule, NgbModule, TranslateModule],
  exports: [],
  declarations: [
    SpoiPrettyInfopanelComponent,
    SpoiPrettyInfopanelFeatureComponent,
  ],
  providers: [SpoiPrettyInfopanelService],
})
export class SpoiPrettyInfopanelModule {}

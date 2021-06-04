import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {HsPanelHelpersModule} from 'hslayers-ng';

import {SpoiPrettyInfopanelComponent} from './pretty-infopanel.component';
import {SpoiPrettyInfopanelService} from './pretty-infopanel.service';

@NgModule({
  imports: [CommonModule, HsPanelHelpersModule, NgbModule, TranslateModule],
  exports: [],
  declarations: [SpoiPrettyInfopanelComponent],
  providers: [SpoiPrettyInfopanelService],
})
export class SpoiPrettyInfopanelModule {}

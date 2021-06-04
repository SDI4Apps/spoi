import {Component, OnInit, ViewRef} from '@angular/core';

import {
  HsLayoutService,
  HsPanelComponent,
  HsQueryBaseService,
} from 'hslayers-ng';

import {SpoiPrettyInfopanelService} from './pretty-infopanel.service';

@Component({
  selector: 'spoi-pretty-infopanel',
  templateUrl: 'pretty-infopanel.component.html',
})
export class SpoiPrettyInfopanelComponent implements HsPanelComponent, OnInit {
  data: any;
  viewRef: ViewRef;

  constructor(
    public prettyInfopanelService: SpoiPrettyInfopanelService,
    public hsLayoutService: HsLayoutService,
    public hsQueryBaseService: HsQueryBaseService
  ) {
    //this.data = this.hsQueryBaseService.data;
  }

  ngOnInit() {}

  isVisible(): boolean {
    return this.hsLayoutService.panelVisible('pretty-info');
  }

  noFeatureSelected(): boolean {
    return this.prettyInfopanelService.noFeatureSelected();
  }
}

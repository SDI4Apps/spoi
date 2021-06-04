import {Component, OnInit, ViewRef} from '@angular/core';

import {HsLayoutService, HsPanelComponent} from 'hslayers-ng';

@Component({
  selector: 'spoi-pretty-infopanel',
  templateUrl: 'pretty-infopanel.component.html',
})
export class SpoiPrettyInfopanelComponent implements HsPanelComponent, OnInit {
  data: any;
  viewRef: ViewRef;

  constructor(public hsLayoutService: HsLayoutService) {}

  ngOnInit() {}

  isVisible(): boolean {
    return this.hsLayoutService.panelVisible('pretty-info');
  }
}

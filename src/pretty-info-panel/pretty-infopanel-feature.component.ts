import {Component, Input} from '@angular/core';

@Component({
  selector: 'spoi-pretty-infopanel-feature',
  templateUrl: 'pretty-infopanel-feature.component.html',
})
export class SpoiPrettyInfopanelFeatureComponent {
  @Input() feature;
  constructor() {}
}

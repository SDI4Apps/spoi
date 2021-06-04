import {Component, Input} from '@angular/core';

import hr_mappings from '../data/human-readable-names.json';

@Component({
  selector: 'spoi-pretty-infopanel-feature',
  templateUrl: 'pretty-infopanel-feature.component.html',
})
export class SpoiPrettyInfopanelFeatureComponent {
  @Input() feature;
  constructor() {}

  prettyAttrName(name: string): string {
    if (Object.keys(hr_mappings.properties).includes(name)) {
      return hr_mappings.properties[name];
    }
    return name;
  }

  prettyAttrValue(value: string): string {
    if (value.includes('#')) {
      return value.split('#')[1];
    }
    return value;
  }
}

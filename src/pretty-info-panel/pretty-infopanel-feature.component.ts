import {Component, Input} from '@angular/core';

import hr_mappings from '../data/human-readable-names.json';
import spoiConfig from '../../spoi.config.json';
import {SpoiPrettyInfopanelService} from './pretty-infopanel.service';

@Component({
  selector: 'spoi-pretty-infopanel-feature',
  templateUrl: 'pretty-infopanel-feature.component.html',
})
export class SpoiPrettyInfopanelFeatureComponent {
  @Input() feature;
  primaryAttributes: Array<string>;
  advancedAttributes: Array<string>;
  metadataAttributes: Array<string>;
  showAdvanced = false;

  constructor(public prettyInfopanelService: SpoiPrettyInfopanelService) {
    this.primaryAttributes = spoiConfig.primaryAttributes;
    this.advancedAttributes = spoiConfig.advancedAttributes;
    this.metadataAttributes = spoiConfig.metadataAttributes;
  }

  prettyAttrName(name: string): string {
    if (Object.keys(hr_mappings.properties).includes(name)) {
      return hr_mappings.properties[name];
    }
    return name;
  }

  prettyAttrValue(attribute: string): string {
    const value = this.feature.attributes.find(
      (attr) => attr.name === attribute
    ).value;
    if (value.includes('#')) {
      return value.split('#')[1];
    }
    return value;
  }

  hasValue(attribute: string): boolean {
    return this.feature.attributes.some((attr) => attr.name === attribute);
  }

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }
}

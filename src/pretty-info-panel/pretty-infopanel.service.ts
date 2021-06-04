import {Injectable} from '@angular/core';

import {HsQueryBaseService} from 'hslayers-ng';

@Injectable({providedIn: 'root'})
export class SpoiPrettyInfopanelService {
  selectedFeatures;

  constructor(public hsQueryBaseService: HsQueryBaseService) {
    this.hsQueryBaseService.getFeatureInfoCollected.subscribe(() => {
      console.log('cooolected');
      console.log(this.hsQueryBaseService.data);
      this.hsQueryBaseService.data.features =
        this.hsQueryBaseService.data.features.map((f) => {
          f.name = f.attributes.find(
            (attr) => attr.name == 'http://www.w3.org/2000/01/rdf-schema#label'
          ).value;
          return f;
        });
    });
  }

  noFeatureSelected(): boolean {
    return (
      this.hsQueryBaseService.data.features.length == 0 &&
      (this.hsQueryBaseService.data.coordinates === undefined ||
        this.hsQueryBaseService.data.coordinates.length == 0)
    );
  }
}

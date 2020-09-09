import * as angular from 'angular';

export class SpoiService {
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  getMaxResolution(category) {
    let default_res = 38;
    //console.log(category);
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#transportation') {
      default_res = 4;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#other') {
      default_res = 19;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#outdoor') {
      default_res = 160;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#car_service') {
      default_res = 20;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#natural_feature') {
      default_res = 160;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#camp_site') {
      default_res = 310;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#lodging') {
      default_res = 160;
    }
    if (category == 'http://gis.zcu.cz/SPOI/Ontology#information') {
      default_res = 160;
    }

    return default_res;
  }

  /**
   * TODO: shall be replaced by UtilsService?
   * @param {string} url Full URL
   * @returns {string} URL part before #
   */
  splitAddress(url) {
    return url.split('#')[1];
  }
}

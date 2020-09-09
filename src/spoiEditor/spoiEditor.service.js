import * as angular from 'angular';

import {Feature} from 'ol';
import {Point} from 'ol/geom';
import {WKT} from 'ol/format';

export class SpoiEditorService {
  hr_mappings = {};

  //Atributes which are displayed without clicking 'For developer' button
  frnly_attribs = [
    'http://www.openvoc.eu/poi#class',
    'http://www.w3.org/2000/01/rdf-schema#comment',
    'http://xmlns.com/foaf/0.1/mbox',
    'http://www.openvoc.eu/poi#fax',
    'http://xmlns.com/foaf/0.1/homepage',
    'http://xmlns.com/foaf/0.1/depiction',
    'http://www.openvoc.eu/poi#openingHours',
    'http://www.openvoc.eu/poi#internetAccess',
    'http://www.openvoc.eu/poi#accessibility',
    'http://www.openvoc.eu/poi#address',
  ];

  not_editable_attrs = [
    'poi_id',
    'http://www.opengis.net/ont/geosparql#sfWithin',
    'http://purl.org/dc/elements/1.1/identifier',
    'http://purl.org/dc/elements/1.1/publisher',
    'http://purl.org/dc/terms/1.1/created',
    'http://www.w3.org/2004/02/skos/core#exactMatch',
    'http://www.sdi4apps.eu/poi/#mainCategory',
    'http://www.w3.org/2002/07/owl#sameAs',
  ];

  constructor($sce, $http, HsCore, HsUtilsService, HsQueryBaseService) {
    'ngInject';
  }

  attrToEnglish(name) {
    const hr_names = {
      'http://xmlns.com/foaf/0.1/mbox': 'E-mail: ',
      'http://www.openvoc.eu/poi#fax': 'Fax: ',
      'http://xmlns.com/foaf/0.1/phone': 'Phone: ',
      'http://www.openvoc.eu/poi#address': 'Address: ',
      'http://www.openvoc.eu/poi#openingHours': 'Opening Hours: ',
      'http://www.openvoc.eu/poi#access': 'Access: ',
      'http://www.openvoc.eu/poi#accessibility': 'Accessibility: ',
      'http://www.openvoc.eu/poi#internetAccess': 'Internet Acces: ',
      'http://www.openvoc.eu/poi#class': 'Category: ',
      'http://xmlns.com/foaf/0.1/homepage': 'Homepage: ',
      'http://www.w3.org/2000/01/rdf-schema#seeAlso': 'More info: ',
      'http://www.w3.org/2004/02/skos/core#exactMatch': 'More info: ',
      'http://purl.org/dc/terms/1.1/created': 'Created: ',
      'http://www.opengis.net/ont/geosparql#sfWithin': 'Country: ',
      'http://www.w3.org/2000/01/rdf-schema#comment': 'Comments: ',
      'http://xmlns.com/foaf/0.1/depiction': 'Photo: ',
    };
    return hr_names[name];
  }

  makeHumanReadable(attribute) {
    const value = this.$sce.valueOf(attribute.value);
    const name = this.$sce.valueOf(attribute.name);
    if (this.hr_mappings[name] === undefined) {
      if (name.indexOf('depiction') > 0) {
        return this.$sce.trustAsHtml(
          '<a target="_blank" href="' +
            value +
            '"><img src="' +
            value +
            '" class="img-thumbnail"/></a>'
        );
      } else if (value.indexOf('http:') == 0) {
        return this.$sce.trustAsHtml(
          '<a href="' + value + '">' + value + '</a>'
        );
      } else {
        return value;
      }
    }
    if (this.hr_mappings[name][value] !== undefined) {
      return this.hr_mappings[name][value];
    } else {
      return attribute.value;
    }
  }

  saveSpoiChanges(attributes) {
    let identifier = '';
    const changes = [];
    angular.forEach(attributes, (a) => {
      if (a.changed !== undefined && a.changed) {
        changes.push({
          attribute: a.name,
          value: this.$sce.valueOf(a.value),
        });
        this.HsQueryBaseService.feature.set(a.name, this.$sce.valueOf(a.value));
      }
      if (a.name == 'http://purl.org/dc/elements/1.1/identifier') {
        identifier = this.$sce.valueOf(a.value);
      }
    });
    const lines = [];
    const d = new Date();
    const n = d.toISOString();
    const change_id =
      'http://www.sdi4apps.eu/poi_changes/change_' +
      this.HsUtilsService.generateUuid();
    const attribute_set_id =
      'http://www.sdi4apps.eu/poi_changes/attributes_' +
      this.HsUtilsService.generateUuid();
    lines.push(
      '<' +
        change_id +
        '> <http://www.sdi4apps.eu/poi_changes/poi_id> <' +
        identifier +
        '>'
    );
    lines.push(
      '<' +
        change_id +
        '> <http://purl.org/dc/terms/1.1/created> "' +
        n +
        '"^^xsd:dateTime'
    );
    lines.push(
      '<' +
        change_id +
        '> <http://www.sdi4apps.eu/poi_changes/status> "unchecked"'
    );
    lines.push(
      '<' +
        change_id +
        '> <http://www.sdi4apps.eu/poi_changes/attribute_set> <' +
        attribute_set_id +
        '>'
    );
    for (const a of changes) {
      lines.push(
        '<' + attribute_set_id + '> <' + a.attribute + '> "' + a.value + '"'
      );
    };

    const query = [
      'INSERT DATA { GRAPH <http://www.sdi4apps.eu/poi_changes.rdf> {',
      lines.join('.'),
      '}}',
    ].join('\n');
    this.$http
      .get(
        'http://data.plan4all.eu/sparql_spoi?default-graph-uri=&query=' +
          encodeURIComponent(query) +
          '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on'
      )
      .then((response) => {
        angular.forEach(attributes, (a) => {
          if (a.changed !== undefined && a.changed) {
            delete a.changed;
          }
        });
      });
  }

  cancelSpoiChanges(attributes) {
    angular.forEach(attributes, (a) => {
      if (a.changed !== undefined && a.changed) {
        a.value = a.original_value;
        a.changed = false;
        a.is_editing = false;
      }
    });
  }

  filterAttribs(items) {
    const filtered = [];
    angular.forEach(items, (item) => {
      if (
        this.frnly_attribs.indexOf(item.name) > -1 ||
        item.name.indexOf('depiction') > 0
      ) {
        filtered.push(item);
      }
    });
    return filtered;
  }

  addPoi(layer, coordinate, country_last_clicked, category) {
    const identifier =
      'http://www.sdi4apps.eu/new_poi/' + this.HsUtilsService.generateUuid();
    this.id = identifier;
    const now = new Date();
    const attrs = {
      geometry: new Point(coordinate),
      'http://purl.org/dc/elements/1.1/identifier': identifier,
      'http://www.w3.org/2000/01/rdf-schema#label': 'New point',
      'http://purl.org/dc/elements/1.1/title': 'New point',
      'http://www.opengis.net/ont/geosparql#sfWithin':
        'http://www.geonames.org/' + country_last_clicked.geonameId,
      'http://purl.org/dc/elements/1.1/publisher':
        'SPOI (http://sdi4apps.eu/spoi)',
      'http://purl.org/dc/elements/1.1/source': '',
      'http://purl.org/dc/elements/1.1/rights':
        'http://opendatacommons.org/licenses/odbl/1.0/',
      'http://www.sdi4apps.eu/poi/#mainCategory': layer.get('category'), //For choosing the icon,
      'http://purl.org/dc/terms/1.1/created': now.toISOString(),
      'http://www.sdi4apps.eu/poi_changes/status': 'unchecked',
    };
    for (const default_attrib of this.frnly_attribs) {
      if (attrs[default_attrib] === undefined) {
        attrs[default_attrib] = '';
      }
    }

    const lines = [];
    lines.push(
      '<{0}> <http://purl.org/dc/elements/1.1/identifier> "{0}"'.format(
        identifier
      )
    );
    const format = new WKT();
    const wkt = format.writeGeometry(
      attrs.geometry.clone().transform('EPSG:3857', 'EPSG:4326')
    );
    lines.push(
      '<{0}> <http://www.opengis.net/ont/geosparql#asWKT> "{1}"^^virtrdf:Geometry'.format(
        identifier,
        wkt
      )
    );
    lines.push(
      '<{0}> <{1}> <{2}>'.format(
        identifier,
        layer.getSource().options.category_field,
        category
      )
    );
    angular.forEach(attrs, (value, attr) => {
      //Geometry has different name in virtuoso, mainCategory is calculated on client side, but depiction is either valid url or doesnt exist in data at all
      if (
        attr != 'geometry' &&
        attr != layer.getSource().options.category_field &&
        attr != 'http://www.sdi4apps.eu/poi/#mainCategory' &&
        attr != 'http://xmlns.com/foaf/0.1/depiction'
      ) {
        lines.push('<{0}> <{1}> "{2}"'.format(identifier, attr, value));
      }
    });
    const query = [
      'prefix virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> INSERT DATA { GRAPH <http://www.sdi4apps.eu/poi_changes.rdf> {',
      lines.join('.'),
      '}}',
    ].join('\n');
    this.$http
      .get(
        'http://data.plan4all.eu/sparql_spoi?default-graph-uri=&query=' +
          encodeURIComponent(query) +
          '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on'
      )
      .then((response) => {});

    attrs[layer.getSource().options.category_field] = category;
    const feature = new Feature(attrs);
    layer.getSource().addFeatures([feature]);
    return feature;
  }

  startEdit(attribute, x) {
    if (attribute.changed === undefined || !attribute.changed) {
      attribute.original_value = attribute.value;
    }
    attribute.is_editing = !(
      attribute.is_editing !== undefined && attribute.is_editing
    );
  }

  attributesHaveChanged(attributes) {
    let tmp = false;
    angular.forEach(attributes, (a) => {
      if (a.changed !== undefined && a.changed) {
        tmp = true;
      }
    });
    return tmp;
  }

  editDropdownVisible(attribute) {
    return (
      attribute.is_editing &&
      this.getSpoiDropdownItems(attribute.name) !== undefined &&
      attribute.name.indexOf('#class') <= 0
    );
  }

  editCategoryDropdownVisible(attribute) {
    return (
      attribute.is_editing &&
      this.getSpoiCategories() !== undefined &&
      attribute.name.indexOf('#class') > 0
    );
  }

  editTextboxVisible(attribute) {
    return attribute.is_editing;
  }

  init() {
    this.hr_mappings = {};
  }

  getSpoiCategories() {
    return this.hr_mappings.category_hierarchy;
  }

  getSpoiDropdownItems(group) {
    return this.hr_mappings[group];
  }

  registerCategory(main_category, main_label, sub_category, sub_label) {
    const o = {
      'http://www.openvoc.eu/poi#class': {},
    };
    if (main_category !== null) {
      const json_sub_category = {};
      json_sub_category[sub_category] = sub_label;
      const json_main_category = {};
      json_main_category[main_category] = json_sub_category;
      o['category_hierarchy'] = json_main_category;
    }
    o['http://www.openvoc.eu/poi#class'][sub_category] = sub_label;
    o['http://www.openvoc.eu/poi#class'][main_category] = main_label;
    this.hr_mappings = angular.merge({}, this.hr_mappings, o);
  }

  getCategoryHierarchy() {
    return this.hr_mappings.category_hierarchy;
  }

  extendMappings(x) {
    this.hr_mappings = angular.merge({}, this.hr_mappings, x);
  }

  getFriendlyAttribs() {
    return this.frnly_attribs;
  }

  getNotEditableAttrs() {
    return this.not_editable_attrs;
  }
}

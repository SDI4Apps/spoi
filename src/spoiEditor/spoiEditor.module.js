import angular from 'angular';
import {spoiEditorService} from './spoiEditor.service';
/**
 * @namespace spoi_editor
 */
angular
  .module('spoi_editor', ['hs.core'])

  .service('spoi_editor', spoiEditorService);

import * as angular from 'angular';
import {SpoiEditorService} from './spoiEditor.service';
/**
 * @namespace spoi_editor
 */
export const SpoiEditorModule = angular
  .module('spoi_editor', ['hs.core'])

  .service('spoi_editor', SpoiEditorService).name;

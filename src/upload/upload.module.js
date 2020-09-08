import * as angular from 'angular';
import {UploadComponent} from './upload.component';

/**
 * @namespace hs.upload
 */
export const UploadModule = angular
  .module('hs.upload', ['hs.core', 'spoi_editor'])

  .component('hs.upload.directive', UploadComponent).name;

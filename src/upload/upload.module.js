import angular from 'angular';
import {UploadComponent} from './upload.component';

/**
 * @namespace uploader
 */
//define(['core', 'demo.min', 'dmuploader', 'spoi_editor'],

//    function() {
angular
  .module('hs.upload', ['hs.core', 'spoi_editor'])

  .component('hs.upload.directive', UploadComponent);
//})

import './demo.min';
import './dmuploader';
import * as angular from 'angular';

export const UploadComponent = {
  template: require('./upload.html'),
  bindings: {
    group: '=',
  },
  controller: class UploadComponent {
    constructor($http, $scope, HsCore, HsUtilsService, spoi_editor) {
      'ngInject';
      angular.element('#drag-and-drop-zone').dmUploader({
        url: 'http://app.hslayers.org/photo-api/upload.php',
        dataType: 'json',
        extraData: {
          id: function () {
            return spoi_editor.id;
          },
        },
        allowedTypes: '*',
        onInit: function () {
          $.danidemo.addLog(
            '#demo-debug',
            'default',
            'Plugin initialized correctly'
          );
        },
        onBeforeUpload: function (id) {
          $.danidemo.addLog(
            '#demo-debug',
            'default',
            'Starting the upload of #' + id
          );

          $.danidemo.updateFileStatus(id, 'default', 'Uploading...');
        },
        onNewFile: function (id, file) {
          $.danidemo.addFile('#demo-files', id, file);
        },
        onComplete: function () {
          $.danidemo.addLog(
            '#demo-debug',
            'default',
            'All pending tranfers completed'
          );
          $('#demo-files').html('All transfers completed');
        },
        onUploadProgress: function (id, percent) {
          const percentStr = percent + '%';

          $.danidemo.updateFileProgress(id, percentStr);
        },
        onUploadSuccess: function (id, data) {
          if (
            data.results !== undefined &&
            data.results.bindings !== undefined &&
            data.results.bindings.length > 1
          ) {
            $.danidemo.updateFileStatus(id, 'success', 'Upload Complete');
            $.danidemo.updateFileProgress(id, '100%');
            $scope.group.attributes.unshift({
              name: 'http://xmlns.com/foaf/0.1/depiction',
              value:
                data.results.bindings[1]['http://xmlns.com/foaf/0.1/depiction'],
            });
            if (!$scope.$parent.$$phase) {
              $scope.$parent.$digest();
            }
          }
        },
        onUploadError: function (id, message) {
          $.danidemo.updateFileStatus(id, 'error', message);

          $.danidemo.addLog(
            '#demo-debug',
            'error',
            'Failed to Upload file #' + id + ': ' + message
          );
        },
        onFileTypeError: function (file) {
          $.danidemo.addLog(
            '#demo-debug',
            'error',
            "File '" + file.name + "' cannot be added: must be an rdf"
          );
        },
        onFileSizeError: function (file) {
          $.danidemo.addLog(
            '#demo-debug',
            'error',
            "File '" + file.name + "' cannot be added: size excess limit"
          );
        },
        onFallbackMode: function (message) {
          $.danidemo.addLog(
            '#demo-debug',
            'info',
            'Browser not supported(do something else here!): ' + message
          );
        },
      });
    }
  },
};

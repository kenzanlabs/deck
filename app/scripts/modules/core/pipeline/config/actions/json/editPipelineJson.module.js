'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.core.pipeline.config.actions.editJson', [
  require('../../../../utils/lodash.js'),
])
  .controller('EditPipelineJsonModalCtrl', function($scope, pipeline, _, $uibModalInstance) {

    this.cancel = $uibModalInstance.dismiss;

    function removeImmutableFields(obj) {
      delete obj.name;
      delete obj.application;
      delete obj.index;
      delete obj.id;
    }

    function updateDeploymentMetadataTags(origPipelineJSON, newPipelineJSON) {
      for (let i = 0; i < newPipelineJSON.stages.length; i++) {
        let stage = newPipelineJSON.stages[i];
        if (stage.type === 'deploy') {
          for (let j = 0; j < stage.clusters.length; j++) {
            let cluster = stage.clusters[j];
            if (origPipelineJSON.stages[i] && origPipelineJSON.stages[i].clusters[j] &&
                !_.isEqual(cluster.blockDevices, origPipelineJSON.stages[i].clusters[j].blockDevices)) {
              cluster.tags['spinnaker:deploymentMetadata'] = 'custom:freeform';
            }
          }
        }
      }
    }

    this.initialize = function() {
      var toCopy = pipeline;
      var pipelineCopy = _.cloneDeep(toCopy, function (value) {
        if (value && value.$$hashKey) {
          delete value.$$hashKey;
        }
      });
      removeImmutableFields(pipelineCopy);

      $scope.isStrategy = pipelineCopy.strategy || false;

      this.originalPipelineJSON = pipelineCopy;
      $scope.command = {
        pipelineJSON: JSON.stringify(pipelineCopy, null, 2)
      };
    };

    this.updatePipeline = function() {
      try {
        var parsed = JSON.parse($scope.command.pipelineJSON);
        parsed.appConfig = parsed.appConfig || {};

        removeImmutableFields(parsed);
        updateDeploymentMetadataTags(this.originalPipelineJSON, parsed);
        angular.extend(pipeline, parsed);
        $uibModalInstance.close();
      } catch (e) {
        $scope.command.invalid = true;
        $scope.command.errorMessage = e.message;
      }
    };

    this.initialize();

  });


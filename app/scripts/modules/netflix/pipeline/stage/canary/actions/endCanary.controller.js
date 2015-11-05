'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.netflix.pipeline.stage.canary.actions.override.result.controller', [
  require('angular-ui-router'),
])
  .controller('EndCanaryCtrl', function ($scope, $http, $modalInstance, settings, canaryId) {

    $scope.command = {
      reason: null,
      result: 'SUCCESS',
    };

    $scope.state = 'editing';

    this.endCanary = function() {
      $scope.state = 'submitting';
      var targetUrl = [settings.gateUrl, 'canaries', canaryId, 'end'].join('/');
      $http.put(targetUrl, $scope.command)
        .success(function() {
          $scope.state = 'success';
        })
        .error(function() {
          $scope.state = 'error';
        });
    };

    this.cancel = $modalInstance.dismiss;

  }).name;

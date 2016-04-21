'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.amazon.serverGroup.configure.wizard.advancedSettings.blockDevices.directive', [
  ])
  .directive('blockDevices', function () {
    return {
      restrict: 'E',
      templateUrl: require('./blockDevices.directive.html'),
      scope: true,
      bindToController: {
        command: '=',
      },
      controllerAs: 'blockDevicesCtrl',
      controller: 'BlockDevicesCtrl',
    };
  }).controller('BlockDevicesCtrl', function ($scope) {
    let self = this,
        currentBlocks = this.command.blockDevices.length;

    this.numberOfBlockDevices = currentBlocks ? currentBlocks : '';
    this.volumeType = currentBlocks ? this.command.blockDevices[0].volumeType : 'gp2';
    this.size = currentBlocks ? this.command.blockDevices[0].size : '';
    this.sizeRequired = !!currentBlocks;
    this.deleteOnTermination = currentBlocks ? this.command.blockDevices[0].deleteOnTermination : true;
    this.volumeSizeMax = 16384;

    this.updateValue = updateValue;
    this.attachDevices = attachDevices;

    $scope.$watch('blockDevicesCtrl.numberOfBlockDevices', (newVal) => {
      if (typeof newVal !== 'undefined' && newVal !== '' && newVal > 0) {
        this.sizeRequired = true;
        this.command.blockDevices = [];
        this.attachDevices(newVal);
      } else {
        this.sizeRequired = false;
        this.command.blockDevices = [];
      }
    });
    $scope.$watch('blockDevicesCtrl.size', (newVal, oldVal) => {
      if (newVal !== oldVal) {
        this.updateValue('size', newVal);
      }
    });
    $scope.$watch('blockDevicesCtrl.volumeType', (newVal, oldVal) => {
      if (newVal === 'gp2') {
        this.volumeSizeMax = 16384;
      } else {
        this.volumeSizeMax = 1024;
      }
      if (newVal !== oldVal) {
        this.updateValue('volumeType', newVal);
      }
    });
    $scope.$watch('blockDevicesCtrl.deleteOnTermination', (newVal, oldVal) => {
      if (newVal !== oldVal) {
        this.updateValue('deleteOnTermination', newVal);
      }
    });
    function updateValue(key, val) {
      self.command.blockDevices.forEach((device)=>{
        device[key] = val;
      });
    }
    function attachDevices(count) {
      while(count) {
        self.command.blockDevices.push({
          'deviceName': deviceNameFromInt(count),
          'size': self.size,
          'volumeType': self.volumeType,
          'deleteOnTermination': self.deleteOnTermination
        });
        count--;
      }
    }
    function deviceNameFromInt(int) {
      return 'dev/sd' + String.fromCharCode(97 + int);
    }
  });

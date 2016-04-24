'use strict';

angular.module('ryanWeb').directive('cesiumMap', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/cesium/cesium.map.html',
        scope: {},
        controller: function() {
            var viewer = new Cesium.Viewer('cesium');
        }
    };
});
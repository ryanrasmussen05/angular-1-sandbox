'use strict';

angular.module('ryanWeb').directive('cesiumMap', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/cesium/cesium.map.html',
        scope: {},
        link: function(scope) {
            console.log('here');
        },
        controller: function($scope, $element) {
            var viewer = new Cesium.Viewer('cesium');
        }
    };
});
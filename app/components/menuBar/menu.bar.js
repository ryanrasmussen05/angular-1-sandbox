'use strict';

angular.module('ryanWeb').directive('menuBar', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/menuBar/menu.bar.html',
        scope: {},
        controller: function($scope) {
            $scope.menuBar = {};

            $scope.menuBar.showMenu = function() {
                $('.left.sidebar').sidebar('toggle');
            };
        }
    };
});
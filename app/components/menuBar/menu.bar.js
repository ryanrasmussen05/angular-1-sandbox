'use strict';

angular.module('ryanWeb').directive('menuBar', function() {
    var $ = require('jquery');

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/menuBar/menu.bar.html',
        scope: {},
        link: function() {
            $('.left.sidebar').find('.item').not('.menu-category').click(function() {
                $('.left.sidebar').sidebar('hide');
            });
        },
        controller: function($scope) {
            $scope.menuBar = {};

            $scope.menuBar.showMenu = function() {
                $('.left.sidebar').sidebar('toggle');
            };
        }
    };
});
'use strict';

angular.module('ryanWeb').directive('canvasRouter', function($routeParams) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/canvas/canvasRouter/canvas.router.html',
        scope: {},
        controller: function($scope) {
            $scope.canvasRouter = {};
            $scope.canvasRouter.page = $routeParams.page;
        }
    };
});
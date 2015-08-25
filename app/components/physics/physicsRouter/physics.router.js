'use strict';

angular.module('ryanWeb').directive('physicsRouter', function($routeParams) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/physicsRouter/physics.router.html',
        scope: {},
        controller: function($scope) {
            $scope.physicsRouter = {};
            $scope.physicsRouter.page = $routeParams.page;
        }
    };
});
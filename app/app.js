'use strict';

var app = angular.module('ryanWeb', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/canvas', {
      templateUrl: 'views/canvas.html'
  }).when('/shopping', {
    templateUrl: 'views/shoppingList.html'
  }).otherwise({
    redirectTo: '/canvas'
  })
}]);


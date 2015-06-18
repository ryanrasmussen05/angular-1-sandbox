'use strict';

var app = angular.module('ryanWeb', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/canvas/:page', {
    templateUrl: 'views/canvas.html'
  }).when('/shopping', {
    templateUrl: 'views/shoppingList.html'
  }).when('/home', {
    templateUrl: 'views/home.html'
  }).otherwise({
    redirectTo: '/home'
  })
}]);


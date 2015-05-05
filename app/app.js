'use strict';

var app = angular.module('ryanWeb', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
      templateUrl: 'views/home.html'
  }).when('/view1', {
    templateUrl: 'views/view1.html'
  }).when('/view2', {
    templateUrl: 'views/view2.html'
  }).otherwise({
    redirectTo: '/home'
  })
}]);


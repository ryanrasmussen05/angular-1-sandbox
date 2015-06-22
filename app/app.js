'use strict';

var angular = require('angular');
require('angular-route');
require('semantic-ui');

var app = angular.module('ryanWeb', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/canvas/:page', {
    templateUrl: 'views/canvas.html'
  }).when('/home', {
    templateUrl: 'views/home.html'
  }).otherwise({
    redirectTo: '/home'
  })
}]);

require('./components/canvas/canvasRouter/canvas.router');
require('./components/canvas/fireworks/fireworks');
require('./components/canvas/particles/particles');
require('./components/menuBar/menu.bar');


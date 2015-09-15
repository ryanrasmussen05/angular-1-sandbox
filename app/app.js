'use strict';

var angular = require('angular');
require('angular-route');
require('semantic');

var app = angular.module('ryanWeb', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home.html'

  }).when('/canvas/:page', {
    templateUrl: function(params) { return 'views/canvas/' + params.page + '.html'; }

  }).when('/physics/:page', {
    templateUrl: function(params) { return 'views/physics/' + params.page + '.html'; }

  }).when('/resume', {
    templateUrl: 'views/resume.html'

  }).when('/airplaneQuiz', {
    templateUrl: 'views/lockheedQuiz.html'

  }).otherwise({
    redirectTo: '/home'
})
}]);

require('./components/airplaneQuiz/airplane.quiz');
require('./components/canvas/fireworks/fireworks');
require('./components/canvas/particles/particles');
require('./components/physics/physicsIntro/physics.intro');
require('./components/physics/solarSystem/solar.system');
require('./components/resume/resume');
require('./components/sandboxLinks/sandbox.links');


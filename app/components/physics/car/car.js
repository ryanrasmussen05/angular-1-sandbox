'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');
require('../../../physics/behavior/torque');

angular.module('ryanWeb').directive('car', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/car/car.html',
        scope: {},
        link: function(scope) {
            scope.init();
        },
        controller: function($scope) {
            var world;

            $scope.init = function() {
                draw();
            };

            $scope.$on('$destroy', function() {
                world.destroy();
            });

            function draw() {
                var width = $('#physics').width();
                var height = $('#physics').height();
                var viewportBounds = Physics.aabb(0, 0, width, height);

                world = Physics({ sleepDisabled: true });

                var renderer = Physics.renderer('canvas', {
                    el: 'physics'
                });
                world.add(renderer);

                world.on('step', function () {
                    world.render();
                });

                Physics.util.ticker.on(function( time ) {
                    world.step( time );
                });

                Physics.util.ticker.start();

                var myWheel = Physics.body('circle', {
                    x: 100,
                    y: 100,
                    radius: 60,
                    cof: 1.0
                });

                world.add(myWheel);

                world.add([
                    Physics.behavior('constant-acceleration'),
                    Physics.behavior('body-impulse-response'),
                    Physics.behavior('torque'),
                    Physics.behavior('edge-collision-detection', {
                        aabb: viewportBounds,
                        restitution: 0.0,
                        cof: 1.0
                    })
                ]);
            }
        }
    };
});
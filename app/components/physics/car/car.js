'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');
require('../../../physics/behavior/torque');
require('../../../physics/body/beam');

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
            var width;
            var height;

            $scope.init = function() {
                setupWorld();
                draw();
            };

            $scope.$on('$destroy', function() {
                world.destroy();
            });

            function setupWorld() {
                width = $('#physics').width();
                height = $('#physics').height();

                world = Physics();

                world.add([
                    Physics.behavior('constant-acceleration'),
                    Physics.behavior('sweep-prune'),
                    Physics.behavior('body-collision-detection'),
                    Physics.behavior('body-impulse-response'),
                    Physics.behavior('edge-collision-detection', {
                        aabb: Physics.aabb(0, 0, width, height),
                        restitution: 0.0,
                        cof: 1.0
                    })
                ]);

                var renderer = Physics.renderer('canvas', {el: 'physics'});
                world.add(renderer);

                world.on('step', function() {
                    world.render();
                });

                Physics.util.ticker.on(function(time) {
                    world.step(time);
                });

                Physics.util.ticker.start();
            }

            function draw() {
                var y = height * 0.9;

                for(var x = 0; x < width; x+=100) {
                    var leftPoint = {
                        x: x,
                        y: y
                    };

                    y = y * 0.95;

                    var rightPoint = {
                        x: x + 100,
                        y: y
                    };

                    var roadSection = Physics.body('beam', {
                        treatment: 'static',
                        restitution: 0.0,
                        cof: 1.0
                    });
                    roadSection.buildFromPoints(leftPoint, rightPoint);

                    world.add(roadSection);
                }

                var myWheel = Physics.body('circle', {
                    x: 100,
                    y: 100,
                    radius: 60,
                    cof: 1.0
                });

                world.add(Physics.behavior('torque').applyTo([myWheel]));
                world.add(myWheel);
            }
        }
    };
});
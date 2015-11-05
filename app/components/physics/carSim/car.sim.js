'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');
require('../../../physics/behavior/torque');
require('../../../physics/body/beam');

angular.module('ryanWeb').directive('carSim', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/carSim/car.sim.html',
        scope: {},
        link: function(scope) {
            scope.init();
        },
        controller: function($scope) {
            var world;
            var width;
            var height;
            var renderer;

            $scope.init = function() {
                setupWorld();
                drawRoad();
                drawCar();
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
                        cof: 0
                    })
                ]);

                renderer = Physics.renderer('canvas', {el: 'physics'});
                world.add(renderer);

                world.on('step', function() {
                    world.render();
                });

                Physics.util.ticker.on(function(time) {
                    world.step(time);
                });

                Physics.util.ticker.start();
            }

            function drawRoad() {
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
            }

            function drawCar() {
                var wheels = [];

                wheels.push(Physics.body('circle', {
                    x: 50,
                    y: 50,
                    radius: 30,
                    cof: 1.0
                }));

                wheels.push(Physics.body('circle', {
                    x: 150,
                    y: 50,
                    radius: 30,
                    cof: 1.0
                }));

                var rigidConstraints = Physics.behavior('verlet-constraints', {
                    iterations: 3
                });

                rigidConstraints.distanceConstraint(wheels[0], wheels[1], 1);

                world.on('render', function(){
                    var constraint = rigidConstraints.getConstraints().distanceConstraints[0];
                    renderer.drawLine(constraint.bodyA.state.pos, constraint.bodyB.state.pos, 'rgba(0, 0, 0, 1.0)');
                });


                world.add(Physics.behavior('torque', {torque: 0.05}).applyTo(wheels));
                world.add(wheels);
                world.add(rigidConstraints);
            }
        }
    };
});
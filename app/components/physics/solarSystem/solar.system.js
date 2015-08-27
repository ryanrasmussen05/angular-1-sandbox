'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('solarSystem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/solarSystem/solar.system.html',
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
                var xMin = (width / 2) - (height / 2);
                var xMax = (width / 2) + (height / 2);
                var gravityStrength = 0.01;

                world = Physics({ sleepDisabled: true });

                var renderer = Physics.renderer('canvas', {
                    el: 'physics'
                });
                world.add(renderer);

                world.on('step', function () {
                    world.render();
                });

                var sun = Physics.body('circle', {
                    x: width / 2,
                    y: height / 2,
                    mass: 333,
                    radius: 20,
                    styles: {
                        fillStyle: '#0000FF'
                    }
                });
                world.add(sun);

                var circles = [];

                for(var counter = 0; counter < 200; counter++){
                    var circle = Physics.body('circle', {
                        x: random(xMin, xMax),
                        y: random(0, height),
                        mass: 0.0022337995,
                        radius: 2,
                        styles: {
                            fillStyle: '#FF0000'
                        }
                    });

                    if(width/2 - 15 < circle.state.pos.x && circle.state.pos.x < width/2 + 15) {
                        circle.state.pos.x = circle.state.pos.x + 30;
                    }
                    if(height/2 - 15 < circle.state.pos.y && circle.state.pos.y < height/2 + 15) {
                        circle.state.pos.y = circle.state.pos.y + 30;
                    }

                    var vector = Physics.vector(circle.state.pos.x - width / 2,circle.state.pos.y - height / 2);
                    var orbitRadius = vector.norm();
                    vector.perp(true);
                    vector.normalize();

                    var orbitSpeed = Math.sqrt(gravityStrength * 333 / orbitRadius);

                    circle.state.vel = vector.mult(orbitSpeed);

                    circles.push(circle);
                }

                world.add(circles);

                world.add([
                    Physics.behavior('newtonian', { strength: gravityStrength }),
                    Physics.behavior('sweep-prune'),
                    Physics.behavior('body-collision-detection', { checkAll: false })
                ]);

                world.on('collisions:detected', function(data) {
                    for(var i = 0; i < data.collisions.length; i++) {
                        var bodyA = data.collisions[i].bodyA;
                        var bodyB = data.collisions[i].bodyB;

                        var newBodyVolume = (4/3 * Math.PI * Math.pow(bodyA.radius, 3)) + (4/3 * Math.PI * Math.pow(bodyB.radius, 3));
                        var newBodyRadius = Math.pow(((3 / (4 * Math.PI)) * newBodyVolume), 1/3);

                        var newBody = Physics.body('circle', {
                            x: bodyA.state.pos.x + data.collisions[i].pos.x,
                            y: bodyA.state.pos.y + data.collisions[i].pos.y,
                            vx: bodyA.state.vel.x,
                            vy: bodyA.state.vel.y,
                            mass: bodyA.mass + bodyB.mass,
                            radius: newBodyRadius,
                            styles: {
                                fillStyle: '#FF0000'
                            }
                        });

                        world.add(newBody);
                        world.remove(bodyA);
                        world.remove(bodyB);
                    }
                });

                Physics.util.ticker.on(function( time ) {
                    world.step( time );
                });

                Physics.util.ticker.start();
            }

            function random(min, max) {
                return (Math.random() * (max - min)) + min;
            }
        }
    };
});
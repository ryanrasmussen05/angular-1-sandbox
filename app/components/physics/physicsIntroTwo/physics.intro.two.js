'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('physicsIntroTwo', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/physicsIntroTwo/physics.intro.two.html',
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
                var gravityStrength = 0.1;

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

                for(var counter = 0; counter < 50; counter++){
                    var circle = Physics.body('circle', {
                        x: random(xMin, xMax),
                        y: random(0, height),
                        mass: 0.004467599,
                        radius: 4,
                        restitution: 0.99,
                        styles: {
                            fillStyle: '#FF0000'
                        }
                    });

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
                    console.log(data.collisions[0].pos.x + ', ' + data.collisions[0].pos.y);
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
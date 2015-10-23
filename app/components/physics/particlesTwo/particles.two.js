'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('particlesTwo', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/particlesTwo/particles.two.html',
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

                var edgeBounce = Physics.behavior('edge-collision-detection', {
                    aabb: viewportBounds,
                    restitution: 1.0, //energy % after collision
                    cof: 0.0 //friction with boundaries
                });

                window.addEventListener('resize', function () {
                    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
                    edgeBounce.setAABB(viewportBounds);
                }, true);

                var circles = [];

                for(var counter = 0; counter < 30; counter++){
                    circles.push(
                        Physics.body('circle', {
                            x: Math.random() * width,
                            y: Math.random() * height,
                            mass: 1,
                            radius: 30,
                            vx: Math.random() * 1 - 0.5,
                            vy: Math.random() * 1 - 0.5,
                            restitution: 1.0,
                            cof: 0.0,
                            styles: {
                                fillStyle: '#FF0000'
                            }
                        })
                    );
                }

                world.add(circles);

                world.add([
                    Physics.behavior('sweep-prune'),
                    Physics.behavior('body-collision-detection'),
                    Physics.behavior('body-impulse-response'),
                    edgeBounce
                ]);

                Physics.util.ticker.on(function( time ) {
                    world.step( time );
                });

                Physics.util.ticker.start();
            }
        }
    };
});
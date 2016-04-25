/* jshint latedef: nofunc */
'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('physicsIntro', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/physicsIntro/physics.intro.html',
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

                world.add(Physics.behavior('interactive', { el: renderer.container }));

                var edgeBounce = Physics.behavior('edge-collision-detection', {
                    aabb: viewportBounds,
                    restitution: 0.99, //energy % after collision
                    cof: 0.8 //friction with boundaries
                });

                window.addEventListener('resize', function () {
                    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
                    edgeBounce.setAABB(viewportBounds);
                }, true);

                var circles = [];

                for(var counter = 0; counter < 180; counter++){
                    circles.push(
                        Physics.body('circle', {
                            x: Math.random() * width, //(width - 10) + 10,
                            y: Math.random() * height, //(height - 10) + 10,
                            mass: 1,
                            radius: 4,
                            vx: Math.random() * 0.01 - 0.005,
                            vy: Math.random() * 0.01 - 0.005,
                            restitution: 0.99,
                            styles: {
                                fillStyle: '#FF0000'
                            }
                        })
                    );
                }

                world.add(circles);

                var attractor = Physics.behavior('attractor', {
                    order: 0,
                    strength: 0.002
                });
                world.on({
                    'interact:poke': function( pos ){
                        world.wakeUpAll();
                        attractor.position( pos );
                        world.add( attractor );
                    },
                    'interact:move': function( pos ){
                        attractor.position( pos );
                    },
                    'interact:release': function(){
                        world.wakeUpAll();
                        world.remove( attractor );
                    }
                });

                world.add([
                    Physics.behavior('newtonian', { strength: 0.01 }),
                    Physics.behavior('sweep-prune'),
                    Physics.behavior('body-collision-detection', { checkAll: false }),
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
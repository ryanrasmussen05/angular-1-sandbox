'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('physics', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/physics.html',
        scope: {},
        link: function(scope) {
            scope.init();
        },
        controller: function($scope) {
            $scope.init = function() {
                draw();
            };

            function draw() {
                var width = $('#physics').width();
                var height = $('#physics').height();
                var world = Physics();

                var renderer = Physics.renderer('canvas', {
                    el: 'physics',
                    width: width,
                    height: height,
                    meta: false, // don't display meta data
                    styles: {
                        // set colors for the circle bodies
                        'circle' : {
                            strokeStyle: '#351024',
                            lineWidth: 1,
                            fillStyle: '#d33682',
                            angleIndicator: '#351024'
                        }
                    }
                });

                // add the renderer
                world.add(renderer);
                // render on each step
                world.on('step', function(){
                    world.render();
                });

                // bounds of the window
                var viewportBounds = Physics.aabb(0, 0, width, height);

                // constrain objects to these bounds
                world.add(Physics.behavior('edge-collision-detection', {
                    aabb: viewportBounds,
                    restitution: 0.99,
                    cof: 0.99
                }));

                // add a circle
                world.add(
                    Physics.body('circle', {
                        x: 50, // x-coordinate
                        y: 30, // y-coordinate
                        vx: 0.2, // velocity in x-direction
                        vy: 0.01, // velocity in y-direction
                        radius: 20
                    })
                );

                // ensure objects bounce when edge collision is detected
                world.add( Physics.behavior('body-impulse-response') );

                // add some gravity
                world.add( Physics.behavior('constant-acceleration') );

                // subscribe to ticker to advance the simulation
                Physics.util.ticker.on(function( time, dt ){
                    world.step( time );
                });

                // start the ticker
                Physics.util.ticker.start();
            }
        }
    };
});
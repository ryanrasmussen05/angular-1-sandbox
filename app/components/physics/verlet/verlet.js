'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('verlet', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/verlet/verlet.html',
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

                // constrain objects to these bounds
                var edgeBounce = Physics.behavior('edge-collision-detection', {
                    aabb: viewportBounds
                    ,restitution: 0.2
                    ,cof: 0.8
                });

                // for constraints
                var rigidConstraints = Physics.behavior('verlet-constraints', {
                    iterations: 3
                });

                // the "basket"
                var basket = [];
                for (var i = 200; i < Math.min(renderer.width - 200, 1000); i += 10){
                    var basketLength = basket.push(
                        Physics.body('circle', {
                            x: i,
                            y: renderer.height / 2,
                            radius: 1,
                            restitution: 0.2,
                            mass: .1,
                            hidden: true
                        })
                    );
                    rigidConstraints.distanceConstraint( basket[ basketLength - 1 ], basket[basketLength - 2 ], 1);
                }

                // falling boxes
                var boxes = [];
                for (i = 0; i < 3; i++){

                    boxes.push( Physics.body('circle', {
                        radius: 50,
                        mass: 0.001,
                        x: 60 * (i % 6) + renderer.width / 2 - (300),
                        y: 60 * (i / 6 | 0) + 50,
                        restitution: 0.9,
                        styles: {
                            fillStyle: '#000099',
                            strokeStyle: '#3399FF',
                            lineWidth: 2
                        }
                    }));
                }

                world.on('render', function(data){
                    var renderer = data.renderer;
                    for ( var i = 1, l = basket.length; i < l; ++i ){
                        renderer.drawLine(basket[ i - 1 ].state.pos, basket[ i ].state.pos, {
                            strokeStyle: '#cb4b16',
                            lineWidth: 3
                        });
                    }
                });

                // fix the ends
                basket[0].treatment = 'static';
                basket[basket.length - 1].treatment = 'static';

                world.add( basket );
                world.add(boxes);
                world.add( rigidConstraints );

                // add some fun interaction
                var attractor = Physics.behavior('attractor', {
                    order: 0,
                    strength: 0.002
                });
                world.on({
                    'interact:poke': function( pos ){
                        world.wakeUpAll();
                        attractor.position( pos );
                        world.add( attractor );
                    }
                    ,'interact:move': function( pos ){
                        attractor.position( pos );
                    }
                    ,'interact:release': function(){
                        world.wakeUpAll();
                        world.remove( attractor );
                    }
                });

                // add things to the world
                world.add([
                    Physics.behavior('interactive', { el: renderer.el })
                    ,Physics.behavior('constant-acceleration')
                    ,Physics.behavior('body-impulse-response')
                    ,Physics.behavior('body-collision-detection')
                    ,Physics.behavior('sweep-prune')
                    ,edgeBounce
                ]);

                // subscribe to ticker to advance the simulation
                Physics.util.ticker.on(function( time ) {
                    world.step( time );
                });
            }
        }
    };
});
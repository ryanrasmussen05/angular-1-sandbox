'use strict';

var Physics = require('physicsjs');
var $ = require('jquery');

angular.module('ryanWeb').directive('bridge', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/physics/bridge/bridge.html',
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
                    aabb: viewportBounds,
                    restitution: 0.1,
                    cof: 0.8
                });

                // for constraints
                var rigidConstraints = Physics.behavior('verlet-constraints', {
                    iterations: 3
                });

                var bridgeLength = Math.floor((width - 400) / 50);

                var bridgeLevelOne = [];
                for(var i = 0; i < bridgeLength; i++) {
                    var bridgeNode = Physics.body('circle', {
                        x: 200 + (i * 50),
                        y: height / 2,
                        radius: 1,
                        mass: 0.5,
                        hidden: true
                    });
                    bridgeLevelOne.push(bridgeNode);
                }

                var bridgeLevelTwo = [];
                for(i = 0; i < bridgeLength; i++) {
                    bridgeNode = Physics.body('circle', {
                        x: 200 + (i * 50),
                        y: height / 2 + 50,
                        radius: 1,
                        mass: 0.5,
                        hidden: true
                    });
                    bridgeLevelTwo.push(bridgeNode);
                }

                bridgeLevelOne[0].treatment = 'static';
                bridgeLevelTwo[0].treatment = 'static';
                bridgeLevelOne[bridgeLength - 1].treatment = 'static';
                bridgeLevelTwo[bridgeLength - 1].treatment = 'static';

                var constraint = 0.5;

                //horizontal trusses
                for(i = 1; i < bridgeLength; i++) {
                    rigidConstraints.distanceConstraint(bridgeLevelOne[i - 1], bridgeLevelOne[i], constraint);
                    rigidConstraints.distanceConstraint(bridgeLevelTwo[i - 1], bridgeLevelTwo[i], constraint);
                }

                //vertical trusses
                for(i = 0; i < bridgeLength; i++) {
                    rigidConstraints.distanceConstraint(bridgeLevelOne[i], bridgeLevelTwo[i], constraint);
                }

                //diagonal trusses
                for (i = 0; i < bridgeLength - 1; i++) {
                    if(i % 2 === 0) {
                        rigidConstraints.distanceConstraint(bridgeLevelOne[i], bridgeLevelTwo[i + 1], constraint);
                    } else {
                        rigidConstraints.distanceConstraint(bridgeLevelTwo[i], bridgeLevelOne[i + 1], constraint);
                    }
                }

                var bridgeLineStyle = {
                    strokeStyle: '#000000',
                    lineWidth: 3
                };

                world.on('render', function(data){
                    var renderer = data.renderer;

                    var constraints = rigidConstraints.getConstraints().distanceConstraints;
                    var scratch = Physics.scratchpad();
                    var v = scratch.vector();
                    var threshold = 1.25;

                    for (i = 0; i < constraints.length; i++ ){
                        var constraint = constraints[i];
                        var length = v.clone(constraint.bodyB.state.pos).vsub(constraint.bodyA.state.pos ).norm();

                        // break the constraint if above threshold
                        if ((constraint.bodyA.treatment !== 'static' && constraint.bodyB.treatment !== 'static') && (length / constraint.targetLength) > threshold ){
                            rigidConstraints.remove(constraint);
                        } else {
                            renderer.drawLine(constraint.bodyA.state.pos, constraint.bodyB.state.pos, bridgeLineStyle);
                        }
                    }
                    scratch.done();
                });

                world.add(bridgeLevelOne);
                world.add(bridgeLevelTwo);
                world.add(rigidConstraints);

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
                    },
                    'interact:move': function( pos ){
                        attractor.position( pos );
                    },
                    'interact:release': function(){
                        world.wakeUpAll();
                        world.remove( attractor );
                    }
                });

                // add things to the world
                world.add([
                    Physics.behavior('interactive', { el: renderer.el }),
                    Physics.behavior('constant-acceleration'),
                    Physics.behavior('body-impulse-response'),
                    Physics.behavior('body-collision-detection'),
                    Physics.behavior('sweep-prune'),
                    edgeBounce
                ]);

                // subscribe to ticker to advance the simulation
                Physics.util.ticker.on(function( time ) {
                    world.step( time );
                });
            }
        }
    };
});
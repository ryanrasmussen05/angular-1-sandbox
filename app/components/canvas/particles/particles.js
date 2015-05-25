'use strict';

angular.module('ryanWeb').directive('particles', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/canvas/particles/particles.html',
        scope: {},
        link: function(scope) {
            $('.ui.dropdown').dropdown({
                onChange: function(value) {
                    scope.canvasTest.orbs = value;
                }
            });

            scope.canvasTest.init();
        },
        controller: function($scope, $rootScope, $window) {
            $scope.canvasTest = {};
            $scope.canvasTest.gravity = false;
            $scope.canvasTest.collisions = false;
            $scope.canvasTest.orbs = 50;

            $scope.canvasTest.canvas = null;
            $scope.canvasTest.ctx = null;

            $scope.canvasTest.width = $('.canvas-wrapper').width();
            $scope.canvasTest.height = $('.canvas-wrapper').height();

            $scope.canvasTest.particles = [];
            $scope.canvasTest.drawInterval = null;

            $scope.$watch('canvasTest.orbs', function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    $window.cancelAnimationFrame($scope.canvasTest.interval);
                    $scope.canvasTest.particles = [];
                    $scope.canvasTest.init();
                }
            });

            $scope.canvasTest.init = function() {
                $scope.canvasTest.canvas = $('#canvas')[0];
                $scope.canvasTest.canvas.width = $scope.canvasTest.width;
                $scope.canvasTest.canvas.height = $scope.canvasTest.height;

                $scope.canvasTest.ctx = $scope.canvasTest.canvas.getContext('2d');

                for(var i = 0; i < $scope.canvasTest.orbs; i++) {
                    $scope.canvasTest.particles.push(new Particle());
                }

                drawLoop();
            };

            $scope.canvasTest.toggleGravity = function() {
                $scope.canvasTest.gravity = !$scope.canvasTest.gravity;
            };

            $scope.canvasTest.toggleCollisions = function() {
                $scope.canvasTest.collisions = !$scope.canvasTest.collisions;
            };

            function drawLoop() {
                $scope.canvasTest.interval = $window.requestAnimationFrame(drawLoop);
                draw();
            }

            function Particle() {
                this.x = Math.random() * $scope.canvasTest.width;
                this.y = Math.random() * $scope.canvasTest.height;
                this.vx = Math.random() * 4 - 2;
                this.vy = Math.random() * 4 - 2;
                this.radius = Math.random() * 20 + 20;

                var r = Math.random() * 255 >> 0;
                var g = Math.random() * 255 >> 0;
                var b = Math.random() * 255 >> 0;
                this.color = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.5)';

                this.mass = Math.PI * Math.pow(this.radius, 2);
            }

            function draw() {
                $scope.canvasTest.ctx.globalCompositeOperation = 'source-over';
                $scope.canvasTest.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                $scope.canvasTest.ctx.fillRect(0, 0, $scope.canvasTest.width, $scope.canvasTest.height);

                $scope.canvasTest.ctx.globalCompositeOperation = 'lighter';

                for(var t = 0; t < $scope.canvasTest.particles.length; t++) {

                    var particle = $scope.canvasTest.particles[t];

                    $scope.canvasTest.ctx.beginPath();

                    var gradient = $scope.canvasTest.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
                    gradient.addColorStop(0, 'white');
                    gradient.addColorStop(0.1, 'white');
                    gradient.addColorStop(0.7, particle.color);
                    gradient.addColorStop(1, 'black');

                    $scope.canvasTest.ctx.fillStyle = gradient;
                    $scope.canvasTest.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                    $scope.canvasTest.ctx.fill();

                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    //vertical acceleration if gravity on
                    if($scope.canvasTest.gravity) {
                        particle.vy += 0.2;
                    }

                    //left right movement
                    if(particle.x < 0 && particle.vx < 0) {
                        particle.vx = particle.vx * -1;
                    } else if(particle.x > $scope.canvasTest.width && particle.vx > 0) {
                        if($scope.canvasTest.gravity) {
                            particle.vx = particle.vx * -0.7;
                        } else {
                            particle.vx = particle.vx * -1;
                        }
                    }

                    //up down movement
                    if(particle.y < 0 && particle.vy < 0) {
                        particle.vy = particle.vy * -1;
                    } else if(particle.y > $scope.canvasTest.height && particle.vy > 0) {
                        if($scope.canvasTest.gravity) {
                            particle.vy = particle.vy * -0.8;
                        } else {
                            particle.vy = particle.vy * -1;
                        }
                    }
                }

                if($scope.canvasTest.collisions) {
                    calculateCollisions();
                }

                if(!$rootScope.$$phase) {
                    $scope.$digest();
                }
            }

            function calculateCollisions() {
                for(var t = 0; t < $scope.canvasTest.particles.length; t++) {

                    var firstBall = $scope.canvasTest.particles[t];

                    for (var u = t + 1; u < $scope.canvasTest.particles.length; u++) {
                        var secondBall = $scope.canvasTest.particles[u];

                        //check for box overlap first for performance reasons
                        if (firstBall.x + firstBall.radius + secondBall.radius > secondBall.x
                            && firstBall.x < secondBall.x + firstBall.radius + secondBall.radius
                            && firstBall.y + firstBall.radius + secondBall.radius > secondBall.y
                            && firstBall.y < secondBall.y + firstBall.radius + secondBall.radius)
                        {
                            //balls are close, now check exact distance
                            var distance = Math.sqrt(Math.pow(firstBall.x - secondBall.x, 2) + Math.pow(firstBall.y - secondBall.y, 2));

                            if (distance < firstBall.radius + secondBall.radius)
                            {
                                //balls have collided

                                //do not recalculate collision if balls are moving apart, prevent overlapping balls issue
                                if(getNextDistance(firstBall, secondBall) < distance) {
                                    var collisionNormal = {};
                                    collisionNormal.x = (firstBall.x - secondBall.x) / distance;
                                    collisionNormal.y = (firstBall.y - secondBall.y) / distance;

                                    //Decompose firstBall velocity into parallel and orthogonal part
                                    var firstBallDot = collisionNormal.x * firstBall.vx + collisionNormal.y * firstBall.vy;
                                    var firstBallCollide = {};
                                    firstBallCollide.x = collisionNormal.x * firstBallDot;
                                    firstBallCollide.y = collisionNormal.y * firstBallDot;
                                    var firstBallRemainder = {};
                                    firstBallRemainder.x = firstBall.vx - firstBallCollide.x;
                                    firstBallRemainder.y = firstBall.vy - firstBallCollide.y;

                                    //Decompose secondBall velocity into parallel and orthogonal part
                                    var secondBallDot = collisionNormal.x * secondBall.vx + collisionNormal.y * secondBall.vy;
                                    var secondBallCollide = {};
                                    secondBallCollide.x = collisionNormal.x * secondBallDot;
                                    secondBallCollide.y = collisionNormal.y * secondBallDot;
                                    var secondBallRemainder = {};
                                    secondBallRemainder.x = secondBall.vx - secondBallCollide.x;
                                    secondBallRemainder.y = secondBall.vy - secondBallCollide.y;

                                    //calculate changes in velocity perpendicular to collision plane, conservation of momentum
                                    var newVelX1 = (firstBallCollide.x * (firstBall.mass - secondBall.mass) + (2 * secondBall.mass * secondBallCollide.x)) / (firstBall.mass + secondBall.mass);
                                    var newVelY1 = (firstBallCollide.y * (firstBall.mass - secondBall.mass) + (2 * secondBall.mass * secondBallCollide.y)) / (firstBall.mass + secondBall.mass);
                                    var newVelX2 = (secondBallCollide.x * (secondBall.mass - firstBall.mass) + (2 * firstBall.mass * firstBallCollide.x)) / (firstBall.mass + secondBall.mass);
                                    var newVelY2 = (secondBallCollide.y * (secondBall.mass - firstBall.mass) + (2 * firstBall.mass * firstBallCollide.y)) / (firstBall.mass + secondBall.mass);

                                    //add collision result to remaining parallel velocities
                                    firstBall.vx = newVelX1 + firstBallRemainder.x;
                                    firstBall.vy = newVelY1 + firstBallRemainder.y;
                                    secondBall.vx = newVelX2 + secondBallRemainder.x;
                                    secondBall.vy = newVelY2 + secondBallRemainder.y;
                                }
                            }
                        }
                    }
                }
            }

            function getNextDistance(firstBall, secondBall) {
                var x1 = firstBall.x + firstBall.vx;
                var y1 = firstBall.y + firstBall.vy;
                var x2 = secondBall.x + secondBall.vx;
                var y2 = secondBall.y + secondBall.vy;

                return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            }
        }
    };
});
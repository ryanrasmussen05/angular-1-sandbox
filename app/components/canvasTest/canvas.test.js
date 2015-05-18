'use strict';

angular.module('ryanWeb').directive('canvasTest', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/canvasTest/canvas.test.html',
        scope: {},
        link: function(scope) {
            scope.canvasTest.init();
        },
        controller: function($scope, $element, $interval) {
            $scope.canvasTest = {};
            $scope.canvasTest.gravity = false;

            $scope.canvasTest.canvas = null;
            $scope.canvasTest.ctx = null;

            $scope.canvasTest.width = $('.canvas-wrapper').width();
            $scope.canvasTest.height = $('.canvas-wrapper').height();

            $scope.canvasTest.particles = [];

            $scope.canvasTest.init = function() {
                $scope.canvasTest.canvas = $('#canvas')[0];
                $scope.canvasTest.canvas.width = $scope.canvasTest.width;
                $scope.canvasTest.canvas.height = $scope.canvasTest.height;

                $scope.canvasTest.ctx = $scope.canvasTest.canvas.getContext('2d');

                for(var i = 0; i < 50; i++) {
                    $scope.canvasTest.particles.push(new Particle());
                }

                $interval(draw, 30);
            };

            $scope.canvasTest.toggleGravity = function() {
                $scope.canvasTest.gravity = !$scope.canvasTest.gravity;
            };

            function Particle() {
                this.x = Math.random() * $scope.canvasTest.width;
                this.y = Math.random() * $scope.canvasTest.height;
                this.vx = Math.random() * 20 - 10;
                this.vy = Math.random() * 20 - 10;
                this.radius = Math.random() * 20 + 20;

                var r = Math.random() * 255 >> 0;
                var g = Math.random() * 255 >> 0;
                var b = Math.random() * 255 >> 0;
                this.color = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.5)';
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
                        particle.vy += 1;
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
            }
        }
    };
});



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

            $scope.canvasTest.canvas = null;
            $scope.canvasTest.ctx = null;

            $scope.canvasTest.width = 500;
            $scope.canvasTest.height = 500;

            $scope.canvasTest.particles = [];

            $scope.canvasTest.init = function() {
                $scope.canvasTest.canvas = $element[0];
                $scope.canvasTest.ctx = $scope.canvasTest.canvas.getContext('2d');

                for(var i = 0; i < 50; i++) {
                    $scope.canvasTest.particles.push(new Particle());
                }

                $interval(draw, 10);
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
                $scope.canvasTest.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                $scope.canvasTest.ctx.fillRect(0, 0, $scope.canvasTest.width, $scope.canvasTest.height);

                $scope.canvasTest.ctx.globalCompositeOperation = 'lighter';

                for(var t = 0; t < $scope.canvasTest.particles.length; t++) {
                    var particle = $scope.canvasTest.particles[t];

                    $scope.canvasTest.ctx.beginPath();

                    var gradient = $scope.canvasTest.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
                    gradient.addColorStop(0, 'white');
                    gradient.addColorStop(0.4, 'white');
                    gradient.addColorStop(0.4, particle.color);
                    gradient.addColorStop(1, 'black');

                    $scope.canvasTest.ctx.fillStyle = gradient;
                    $scope.canvasTest.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                    $scope.canvasTest.ctx.fill();

                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    if(particle.x < -50) particle.x = $scope.canvasTest.width + 50;
                    if(particle.y < -50) particle.y = $scope.canvasTest.height + 50;
                    if(particle.x > $scope.canvasTest.width + 50) particle.x = -50;
                    if(particle.y > $scope.canvasTest.height + 50) particle.y = -50;
                }
            }
        }
    };
});



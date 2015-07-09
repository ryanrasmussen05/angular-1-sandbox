'use strict';

angular.module('ryanWeb').directive('fireworks', function() {
    var $ = require('jquery');

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/canvas/fireworks/fireworks.html',
        scope: {},
        link: function(scope) {
            scope.fireworks.init();
        },
        controller: function($scope, $interval) {
            var canvas = $('#canvas')[0];
            var ctx = canvas.getContext('2d');
            var width = $('.canvas-wrapper').width();
            var height = $('.canvas-wrapper').height();

            var fireworks = [];
            var particles = [];
            var hue = 120;

            var mousedown = false;
            var mouseX;
            var mouseY;

            var timerTick = 0;
            var timerTotal = 80;
            var limiterTick = 0;
            var limiterTotal = 5;

            $scope.fireworks = {};

            $scope.fireworks.init = function() {
                initCanvas();
            };

            function initCanvas() {
                canvas.width = width;
                canvas.height = height;

                addMouseListeners();

                $interval(draw, 16);
            }

            function draw() {
                hue += 0.5;

                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, width, height);
                ctx.globalCompositeOperation = 'lighter';

                for(var i = 0; i < fireworks.length; i++) {
                    fireworks[i].draw();
                    fireworks[i].update();
                }

                for(i = 0; i < particles.length; i++) {
                    particles[i].draw();
                    particles[i].update();
                }

                if(timerTick >= timerTotal) {
                    if(!mousedown) {
                        fireworks.push(new Firework(width / 2, height, random(width / 3, 2 * width / 3), random(0, height / 2)));
                        timerTick = 0;
                    }
                } else {
                    timerTick++;
                }

                if(limiterTick >= limiterTotal) {
                    if(mousedown) {
                        fireworks.push(new Firework(width / 2, height, mouseX, mouseY));
                        limiterTick = 0;
                    }
                } else {
                    limiterTick++;
                }
            }

            function Firework(startX, startY, targetX, targetY) {
                //current firework position
                this.x = startX;
                this.y = startY;

                //track past coordinates to create light trail behind firework
                this.coordinates = [];
                this.coordinateCount = 1;

                //initial coordinates array
                while(this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }

                this.angle = Math.atan2(targetY - startY, targetX - startX);
                this.speed = random(10, 13);
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                this.brightness = random(50, 70);

                this.fuseTime = 100;
                this.currentTime = 0;
            }

            Firework.prototype.update = function(index) {
                //remove last coordinate, add current coordinate
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.vy = this.vy + 0.1;
                this.currentTime++;

                //blow up if fuse timer runs out, or near edges
                if(this.fuseTime <= this.currentTime || this.x < 50 || this.x > width - 50 || this.y < 50) {
                    createParticles(this.x, this.y);
                    fireworks.splice(index, 1);
                } else {
                    this.x += this.vx;
                    this.y += this.vy;
                }
            };

            Firework.prototype.draw = function() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = 'hsl(' + hue + ',100%,' + this.brightness + '%';
                ctx.stroke();
            };

            function Particle(x, y) {
                this.x = x;
                this.y = y;
                this.angle = random(0, Math.PI * 2);

                this.speed = random(1, 5);
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;

                this.friction = 0.95;
                this.gravity = 0.05;
                this.hue = random(hue - 20, hue + 20);
                this.brightness = random(50, 80);
                this.alpha = 1;
                //this.decay = random(0.015, 0.03);
                this.decay = random(0.005, 0.015);

                this.coordinates = [];
                this.coordinateCount = 5;

                while(this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
            }

            Particle.prototype.update = function(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.x += this.vx;
                this.y += this.vy;

                this.vx *= this.friction;
                this.vy = (this.vy * this.friction) + this.gravity;

                this.alpha -= this.decay;

                if(this.alpha <= this.decay) {
                    particles.splice(index, 1);
                }
            };

            Particle.prototype.draw = function() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')';
                ctx.stroke();
            };

            function createParticles(x, y) {
                var particleCount = 50;
                while(particleCount--) {
                    particles.push(new Particle(x,y));
                }
            }

            function addMouseListeners() {
                canvas.addEventListener('mousemove', function(e) {
                    mouseX = e.pageX - canvas.offsetLeft;
                    mouseY = e.pageY - canvas.offsetTop;
                });

                canvas.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    mousedown = true;
                });

                canvas.addEventListener('mouseup', function(e) {
                    e.preventDefault();
                    mousedown = false;
                });
            }

            function random(min, max) {
                return Math.random() * (max - min) + min;
            }
        }
    };
});
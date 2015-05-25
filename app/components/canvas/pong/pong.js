'use strict';

angular.module('ryanWeb').directive('pong', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/canvas/pong/pong.html',
        scope: {},
        link: function(scope) {
            scope.pong.initialize();
        },
        controller: function($scope, $window, $timeout) {
            $scope.pong = {};
            $scope.pong.canvas = null;
            $scope.pong.ctx = null;

            $scope.pong.height = null;
            $scope.pong.width = null;

            $scope.pong.particles = [];
            $scope.pong.ball = {};
            $scope.pong.paddles = [];
            $scope.pong.mouse = {};
            $scope.pong.points = 0;
            $scope.pong.fps = 60;
            $scope.pong.particlesCount = 20;
            $scope.pong.flag = false;
            $scope.pong.collisionLocation = {};
            $scope.pong.multiplier = 1;
            $scope.pong.startButton = {};
            $scope.pong.restartButton = {};
            $scope.pong.over = false;
            $scope.pong.init = null;
            $scope.pong.paddleHit = null;

            $scope.pong.initialize = function() {
                $scope.pong.canvas = $('#canvas')[0];

                $scope.pong.height = $('.canvas-wrapper').height();
                $scope.pong.width = ($scope.pong.height / 3) * 2;

                $scope.pong.canvas.width = $scope.pong.width;
                $scope.pong.canvas.height = $scope.pong.height;

                $scope.pong.ctx = $scope.pong.canvas.getContext('2d');
                $scope.pong.canvas.addEventListener("mousemove", trackPosition, true);
                $scope.pong.canvas.addEventListener("mousedown", buttonClick, true);

                $scope.pong.paddles.push(new Paddle("bottom"));
                $scope.pong.paddles.push(new Paddle("top"));

                initBall();
                initStartButton();
                initRestartButton();

                startup();
            };

            function paintCanvas() {
                $scope.pong.ctx.fillStyle = 'black';
                $scope.pong.ctx.fillRect(0, 0, $scope.pong.width, $scope.pong.height);
            }

            function Paddle(position) {
                this.height = 5;
                this.width = 150;
                this.x = $scope.pong.width / 2 - this.width / 2;
                this.y = (position === "top") ? 0 : $scope.pong.height - this.height;
            }

            function initBall() {
                $scope.pong.ball = {
                    x: 50,
                    y: 50,
                    vx: 4,
                    vy: 8,
                    radius: 5,
                    color: "white",
                    draw: function() {
                        $scope.pong.ctx.beginPath();
                        $scope.pong.ctx.fillStyle = this.color;
                        $scope.pong.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
                        $scope.pong.ctx.fill();
                    }
                };
            }

            function initStartButton() {
                $scope.pong.startButton = {
                    width: 100,
                    height: 50,
                    x: $scope.pong.width / 2 - 50,
                    y: $scope.pong.height / 2 - 25,
                    draw: function() {
                        $scope.pong.ctx.strokeStyle = "white";
                        $scope.pong.ctx.lineWidth = "2";
                        $scope.pong.ctx.strokeRect(this.x, this.y, this.width, this.height);
                        $scope.pong.ctx.font = "18px Arial, sans-serif";
                        $scope.pong.ctx.textAlign = "center";
                        $scope.pong.ctx.textBaseline = "middle";
                        $scope.pong.ctx.fillStlye = "white";
                        $scope.pong.ctx.fillText("Start", $scope.pong.width / 2, $scope.pong.height / 2);
                    }
                };
            }

            function initRestartButton() {
                $scope.pong.restartButton = {
                    width: 100,
                    height: 50,
                    x: $scope.pong.width / 2 - 50,
                    y: $scope.pong.height / 2 - 50,
                    draw: function() {
                        $scope.pong.ctx.strokeStyle = "white";
                        $scope.pong.ctx.lineWidth = "2";
                        $scope.pong.ctx.strokeRect(this.x, this.y, this.width, this.height);
                        $scope.pong.ctx.font = "18px Arial, sans-serif";
                        $scope.pong.ctx.textAlign = "center";
                        $scope.pong.ctx.textBaseline = "middle";
                        $scope.pong.ctx.fillStlye = "white";
                        $scope.pong.ctx.fillText("Restart", $scope.pong.width / 2, $scope.pong.height / 2 - 25 );
                    }
                }
            }

            function Particle(x, y, m) {
                this.x = x || 0;
                this.y = y || 0;
                this.radius = 1.2;
                this.vx = -1.5 + Math.random()*3;
                this.vy = m * Math.random()*1.5;
            }

            function draw() {
                paintCanvas();
                for(var i = 0; i < $scope.pong.paddles.length; i++) {
                    var paddle = $scope.pong.paddles[i];

                    $scope.pong.ctx.fillStyle = "white";
                    $scope.pong.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
                }

                $scope.pong.ball.draw();
                update();
            }

            function increaseSpeed() {
                if($scope.pong.points % 4 == 0) {
                    if(Math.abs($scope.pong.ball.vx) < 15) {
                        $scope.pong.ball.vx += ($scope.pong.ball.vx < 0) ? -1 : 1;
                        $scope.pong.ball.vy += ($scope.pong.ball.vy < 0) ? -2 : 2;
                    }
                }
            }

            function trackPosition(e) {
                $scope.pong.mouse.x = e.pageX - $('#canvas').offset().left;
                $scope.pong.mouse.y = e.pageY;
            }

            function update() {
                updateScore();

                // Move the paddles on mouse move
                if($scope.pong.mouse.x && $scope.pong.mouse.y) {
                    for(var i = 0; i < $scope.pong.paddles.length; i++) {
                        $scope.pong.paddles[i].x = $scope.pong.mouse.x - $scope.pong.paddles[i].width / 2;
                    }
                }

                $scope.pong.ball.x += $scope.pong.ball.vx;
                $scope.pong.ball.y += $scope.pong.ball.vy;

                if(collision($scope.pong.ball, $scope.pong.paddles[0])) {
                    onCollision($scope.pong.ball, $scope.pong.paddles[0]);
                }
                else if(collision($scope.pong.ball, $scope.pong.paddles[1])) {
                    onCollision($scope.pong.ball, $scope.pong.paddles[1]);
                }
                else {
                    if($scope.pong.ball.y + $scope.pong.ball.radius > $scope.pong.height) {
                        $scope.pong.ball.y = $scope.pong.height - $scope.pong.ball.radius;
                        gameOver();
                    } else if($scope.pong.ball.y < 0) {
                        $scope.pong.ball.y = $scope.pong.ball.radius;
                        gameOver();
                    }

                    if($scope.pong.ball.x + $scope.pong.ball.radius > $scope.pong.width) {
                        $scope.pong.ball.vx = $scope.pong.ball.vx * -1;
                        $scope.pong.ball.x = $scope.pong.width - $scope.pong.ball.radius;
                    } else if($scope.pong.ball.x - $scope.pong.ball.radius < 0) {
                        $scope.pong.ball.vx = $scope.pong.ball.vx * -1;
                        $scope.pong.ball.x = $scope.pong.ball.radius;
                    }
                }

                if($scope.pong.flag) {
                    for(var k = 0; k < $scope.pong.particlesCount; k++) {
                        $scope.pong.particles.push(new Particle($scope.pong.collisionLocation.x, $scope.pong.collisionLocation.y, $scope.pong.multiplier));
                    }
                }

                emitParticles();
                $scope.pong.flag = false;
            }

            function collision(ball, paddle) {
                if(ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width) {
                    if(ball.y >= (paddle.y - paddle.height) && paddle.y > 0){
                        $scope.pong.paddleHit = 1;
                        return true;
                    } else if(ball.y <= paddle.height && paddle.y === 0) {
                        $scope.pong.paddleHit = 2;
                        return true;
                    }
                }
                return false;
            }

            function onCollision(ball, paddle) {
                ball.vy = ball.vy * -1;

                if($scope.pong.paddleHit === 1) {
                    ball.y = paddle.y - paddle.height;
                    $scope.pong.collisionLocation.y = ball.y + ball.radius;
                    $scope.pong.multiplier = -1;
                } else if($scope.pong.paddleHit == 2) {
                    ball.y = paddle.height + ball.radius;
                    $scope.pong.collisionLocation.y = ball.y - ball.radius;
                    $scope.pong.multiplier = 1;
                }

                $scope.pong.points++;
                increaseSpeed();

                $scope.pong.collisionLocation.x = ball.x;
                $scope.pong.flag = true;
            }

            function emitParticles() {
                for(var j = 0; j < $scope.pong.particles.length; j++) {
                    var particle = $scope.pong.particles[j];

                    $scope.pong.ctx.beginPath();
                    $scope.pong.ctx.fillStyle = "white";
                    if (particle.radius > 0) {
                        $scope.pong.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI*2, false);
                    }
                    $scope.pong.ctx.fill();

                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Reduce radius so that the particles die after a few seconds
                    particle.radius = Math.max(particle.radius - 0.05, 0.0);
                }
            }

            function updateScore() {
                $scope.pong.ctx.fillStlye = "white";
                $scope.pong.ctx.font = "16px Arial, sans-serif";
                $scope.pong.ctx.textAlign = "left";
                $scope.pong.ctx.textBaseline = "top";
                $scope.pong.ctx.fillText("Score: " + $scope.pong.points, 20, 20 );
            }

            function gameOver() {
                $scope.pong.ctx.fillStlye = "white";
                $scope.pong.ctx.font = "20px Arial, sans-serif";
                $scope.pong.ctx.textAlign = "center";
                $scope.pong.ctx.textBaseline = "middle";
                $scope.pong.ctx.fillText("Game Over - You scored " + $scope.pong.points + " points!", $scope.pong.width / 2, $scope.pong.height / 2 + 25 );

                // Stop the Animation
                $window.cancelAnimationFrame($scope.pong.init);
                // Set the over flag
                $scope.pong.over = true;
                // Show the restart button
                $scope.pong.restartButton.draw();
            }

            function buttonClick(e) {
                var mx = e.pageX - $('#canvas').offset().left;
                var my = e.pageY;

                if(mx >= $scope.pong.startButton.x && mx <= $scope.pong.startButton.x + $scope.pong.startButton.width) {
                    animloop();
                }

                if($scope.pong.over) {
                    if(mx >= $scope.pong.restartButton.x && mx <= $scope.pong.restartButton.x + $scope.pong.restartButton.width) {
                        $scope.pong.ball.x = 20;
                        $scope.pong.ball.y = 20;
                        $scope.pong.points = 0;
                        $scope.pong.ball.vx = 4;
                        $scope.pong.ball.vy = 8;
                        animloop();

                        $scope.pong.over = false;
                    }
                }
            }

            function animloop() {
                $scope.pong.init = $window.requestAnimationFrame(animloop);
                draw();
            }

            function startup() {
                draw();
                $scope.pong.startButton.draw();
            }
        }
    };
});
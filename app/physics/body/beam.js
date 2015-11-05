'use strict';

var Physics = require('physicsjs');

Physics.body('beam', 'rectangle', function(parent) {
    return {
        buildFromPoints: function(pointA, pointB) {

            var centerPoint = {
                x: (pointA.x + pointB.x) / 2,
                y: (pointA.y + pointB.y) / 2
            };

            var scratch = Physics.scratchpad();
            var tempVector = scratch.vector().set(pointB.x - pointA.x, pointB.y - pointA.y);
            var angle = tempVector.angle() + (Math.PI / 2);
            var length = tempVector.norm();
            scratch.done();

            this.state.pos.x = centerPoint.x;
            this.state.pos.y = centerPoint.y;

            this.geometry.width = 5;
            this.geometry.height = length;

            this.state.angular.pos = angle;
        }
    }
});
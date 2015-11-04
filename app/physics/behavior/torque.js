'use strict';

var Physics = require('physicsjs');

Physics.behavior('torque', function(parent) {

    var defaults = {
        torque: 0.1
    };

    return {
        init: function(options) {
            parent.init.call(this);
            this.options.defaults(defaults);
            this.options(options);
        },

        behave: function(data) {
            var bodies = this.getTargets();

            for(var i = 0; i < bodies.length; i++) {
                var angularAcceleration = this.options.torque / bodies[i].moi;

                bodies[i].state.angular.vel = bodies[i].state.angular.vel + angularAcceleration;
            }
        }
    }
});
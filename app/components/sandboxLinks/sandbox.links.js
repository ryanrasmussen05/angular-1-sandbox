'use strict';

angular.module('ryanWeb').directive('sandboxLinks', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/sandboxLinks/sandbox.links.html',
        scope: {},
        controller: function($scope) {
            $scope.sandboxLinks = {};

            $scope.sandboxLinks.categories = [
                {
                    title: 'HTML Canvas',
                    icon: 'paint brush',
                    description: 'Various animations created using HTML Canvas to manually draw graphics',
                    pages: [
                        {
                            title: 'Particles',
                            description: 'Animation of colliding circles, manually updating positions using vector calculation and conservation of momentum',
                            link: '#/canvas/particles'
                        },
                        {
                            title: 'Fireworks',
                            description: 'Fireworks simulation, calculating change in trajectory due to gravity and random particle burst',
                            link: '#/canvas/fireworks'
                        }
                    ]
                },
                {
                    title: 'Physics JS',
                    icon: 'rocket',
                    description: 'Experimenting with the new Physics JS library',
                    pages: [
                        {
                            title: 'Intro',
                            description: 'Initial test of the Physics library, shows Newtonian behaviour of a random scattering of particles',
                            link: '#/physics/intro'
                        },
                        {
                            title: 'Solar System',
                            description: 'Simulation of the formation of a solar system, with a sun in the center and particles orbiting and aggregating into planets',
                            link: '#/physics/solarSystem'
                        }
                    ]
                }
            ];
        }
    };
});
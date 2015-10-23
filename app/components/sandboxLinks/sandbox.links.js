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
                            link: '#/canvas/particles'
                        },
                        {
                            title: 'Fireworks',
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
                            title: 'Newtonian Intro',
                            link: '#/physics/intro'
                        },
                        {
                            title: 'Particles II',
                            link: '#/physics/particlesTwo'
                        },
                        {
                            title: 'Solar System',
                            link: '#/physics/solarSystem'
                        },
                        {
                            title: 'Verlet Constraints Rubber Band',
                            link: '#/physics/verlet'
                        },
                        {
                            title: 'Bridge Test',
                            link: '#/physics/bridge'
                        }
                    ]
                }
            ];
        }
    };
});
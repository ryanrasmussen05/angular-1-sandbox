'use strict';

angular.module('ryanWeb').directive('montyHall', function() {
    var _ = require('lodash');
    var doors = [1,2,3];

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/montyHall/monty.hall.html',
        scope: {},
        link: function(scope) {
            scope.montyHall.reset();
        },
        controller: function($scope) {
            $scope.montyHall = {};
            $scope.montyHall.openDoors = [];
            $scope.montyHall.winningDoor = null;
            $scope.montyHall.selectedDoor = null;
            $scope.montyHall.state = '';

            $scope.montyHall.randomWinner = function() {
                $scope.montyHall.winningDoor = Math.floor(Math.random() * 3) + 1;
            };

            $scope.montyHall.reset = function() {
                $scope.montyHall.randomWinner();
                $scope.montyHall.openDoors = [];
                $scope.montyHall.state = 'initial';
                $scope.montyHall.selectedDoor = null;
            };

            $scope.montyHall.openDoor = function(doorNumber) {
                $scope.montyHall.openDoors.push(doorNumber);
            };

            $scope.montyHall.isDoorOpen = function(doorNumber) {
                return $scope.montyHall.openDoors.indexOf(doorNumber) >= 0;
            };

            $scope.montyHall.doorAction = function(doorNumber) {
                if($scope.montyHall.state === 'initial') {
                    $scope.montyHall.selectedDoor = doorNumber;
                    $scope.montyHall.state = 'openLoser';
                }
            };

            $scope.montyHall.openRandomLoser = function() {
                var losingDoors = [];
                var randomRatio = Math.random();

                for(var i = 1; i <= 3; i++) {
                    if(i !== $scope.montyHall.winningDoor && i !== $scope.montyHall.selectedDoor) {
                        losingDoors.push(i);
                    }
                }

                if(randomRatio < 0.5 || losingDoors.length === 1) {
                    $scope.montyHall.openDoor(losingDoors[0]);
                } else {
                    $scope.montyHall.openDoor(losingDoors[1]);
                }

                $scope.montyHall.state = 'keepSwitch';
            };

            $scope.montyHall.switch = function(shouldSwitch){
                if(shouldSwitch) {

                    $scope.montyHall.selectedDoor = _.find(doors, function(door) {
                        return !_.includes($scope.montyHall.openDoors, door) && $scope.montyHall.selectedDoor !== door;
                    });
                }
                $scope.montyHall.state = 'reveal';
            };

            $scope.montyHall.finish = function() {
                var win = $scope.montyHall.selectedDoor === $scope.montyHall.winningDoor;
                $scope.montyHall.finishText = win ? 'You Win!!!' : 'You Lost';

                _.each(doors, $scope.montyHall.openDoor);
                $scope.montyHall.state = 'gameOver';
            };
        }
    };
});
'use strict';

angular.module('ryanWeb').directive('montyHall', function() {
    var $ = require('jquery');
    var _ = require('lodash');
    var doors = [1,2,3];
    var numberTests = 1000;
    var testSpeed = 2;

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/montyHall/monty.hall.html',
        scope: {},
        link: function(scope) {
            scope.montyHall.reset();
        },
        controller: function($scope, $timeout) {
            $scope.montyHall = {};
            $scope.montyHall.openDoors = [];
            $scope.montyHall.winningDoor = null;
            $scope.montyHall.selectedDoor = null;
            $scope.montyHall.testResults = {winners: [], losers: []};
            $scope.montyHall.state = '';

            $scope.montyHall.randomWinner = function() {
                $scope.montyHall.winningDoor = Math.floor(Math.random() * 3) + 1;
            };

            $scope.montyHall.reset = function() {
                $scope.montyHall.randomWinner();
                $scope.montyHall.openDoors = [];
                $scope.montyHall.state = 'initial';
                $scope.montyHall.selectedDoor = null;
                $scope.montyHall.testOutputs = [];
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

            $scope.montyHall.runTest = function(shouldSwitch, testNumber) {
                $scope.montyHall.runningTest = true;
                $('.test-output-container').scrollTop(100000);

                if(!testNumber) {
                    testNumber = 1;
                } else if(testNumber > numberTests) {
                    $scope.montyHall.testResult = 'Won: ' + $scope.montyHall.testResults.winners.length + '    Lost: ' + $scope.montyHall.testResults.losers.length;
                    $scope.montyHall.testResults = {winners: [], losers: []};
                    $scope.montyHall.state = 'testCompleted';
                    $scope.montyHall.runningTest = false;
                    $scope.$apply();
                    return;
                }

                $scope.montyHall.randomWinner();
                $scope.montyHall.openDoors = [];
                $scope.montyHall.state = 'initial';
                $scope.montyHall.selectedDoor = null;

                var randomSelection = Math.floor(Math.random() * 3) + 1;
                $scope.montyHall.doorAction(randomSelection);

                $timeout(function() {
                    $scope.montyHall.openRandomLoser();
                    $timeout(function() {
                        $scope.montyHall.switch(shouldSwitch);
                        $timeout(function() {
                            $scope.montyHall.finish();

                            var win = $scope.montyHall.selectedDoor === $scope.montyHall.winningDoor;

                            if(win) {
                                $scope.montyHall.testResults.winners.push(testNumber);
                                $scope.montyHall.testOutputs.push('WIN');
                            } else {
                                $scope.montyHall.testResults.losers.push(testNumber);
                                $scope.montyHall.testOutputs.push('LOSE');
                            }

                            $scope.montyHall.runTest(shouldSwitch, ++testNumber);
                        }, testSpeed);
                    }, testSpeed);
                }, testSpeed);
            };
        }
    };
});
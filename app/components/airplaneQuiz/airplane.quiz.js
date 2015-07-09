'use strict';

angular.module('ryanWeb').directive('airplaneQuiz', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/airplaneQuiz/airplane.quiz.html',
        scope: {},
        controller: function($scope) {
            $scope.airplaneQuiz = {};
            $scope.airplaneQuiz.activeQuestion = null;
            $scope.airplaneQuiz.aircraftResult = null;

            $scope.airplaneQuiz.setActiveQuestion = function(questionNumber) {
                $scope.airplaneQuiz.activeQuestion = questionNumber;
            };

            $scope.airplaneQuiz.setAircraftResult = function(aircraftResult) {
                $scope.airplaneQuiz.activeQuestion = null;
                $scope.airplaneQuiz.aircraftResult = aircraftResult;
            };

            $scope.airplaneQuiz.startQuiz = function() {
                $scope.airplaneQuiz.activeQuestion = 1;
                $scope.airplaneQuiz.aircraftResult = null;
            };

            $scope.airplaneQuiz.showStartButton = function() {
                return $scope.airplaneQuiz.activeQuestion === null && $scope.airplaneQuiz.aircraftResult === null;
            };

            $scope.airplaneQuiz.showRestartButton = function() {
                return $scope.airplaneQuiz.activeQuestion === null && $scope.airplaneQuiz.aircraftResult !== null;
            };
        }
    };
});
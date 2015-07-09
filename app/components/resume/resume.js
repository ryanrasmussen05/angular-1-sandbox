'use strict';

angular.module('ryanWeb').directive('resume', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/resume/resume.html',
        scope: {}
    };
});
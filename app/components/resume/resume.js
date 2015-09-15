'use strict';

angular.module('ryanWeb').directive('resume', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/resume/resume.html',
        scope: {},
        controller: function($scope) {
            $scope.resume = {};

            $scope.resume.jobs = [
                {
                    image: 'images/resume/aviture.png',
                    title: 'Software Engineer',
                    company: 'Aviture',
                    location: 'Omaha, NE',
                    start: 'July 2014',
                    end: 'present',
                    bullets: [
                        'Work with an Agile team of developers on both client-side and server-side of several web applications',
                        'Technologies utilized include: AngularJS, Spring MVC, Web Sockets, Cesium, Gulp, Browserify, Karma',
                        'Work with UX Designers to create GUIs while gaining expertise in front-end frameworks such as Semantic-UI and Bootstrap',
                        'Serve as rotating sprint lead, coordinating meetings and leading sprint retrospectives'
                    ]
                },
                {
                    image: 'images/resume/lockheed.png',
                    title: 'Software Engineer',
                    company: 'Lockheed Martin',
                    location: 'Papillion, NE',
                    start: 'June 2013',
                    end: 'July 2014',
                    bullets: [
                        'Java/Web Developer on the Global Adaptive Planning Collaborative Information Environment (GAP CIE) contract',
                        'GAP CIE consists of several Java services implementing Spring, Hibernate, GWT, JSP, and Javascript',
                        'Develop and debug code using Eclipse, Oracle WebLogic Server, and SQL Developer',
                        'Work bugs and new features as assigned, as well as working with Systems Engineers to develop requirements and technical approaches',
                        'Participate on both Agile and Waterfall teams'
                    ]
                },
                {
                    image: 'images/resume/nebraskaglobal.png',
                    title: 'Software Engineer Intern',
                    company: 'Nebraska Global',
                    location: 'Lincoln, NE',
                    start: 'August 2012',
                    end: 'May 2013',
                    bullets: [
                        'Worked on an individual project to develop an internal application used by software start-up EliteForm',
                        'Developed an MVC web application using C# .NET and Visual Studio which gathers user metrics from the EliteForm database using Entity Framework and standard SQL queries',
                        'Developed UI to cleanly present gathered information'
                    ]
                },
                {
                    image: 'images/resume/duncanaviation.png',
                    title: 'Web Software Developer Intern',
                    company: 'Duncan Aviation',
                    location: 'Lincoln, NE',
                    start: 'December 2011',
                    end: 'August 2012',
                    bullets: [
                        'Worked with a team of developers to convert Duncan Aviation\'s myDuncan website into a mobile web application using the Responsive Web Design approach',
                        'Gained in-depth experience with Java, JSF, HTML, and CSS'
                    ]
                }
            ];

            $scope.resume.schools = [
                {
                    image: 'images/resume/unl.png',
                    name: 'University of Nebraska',
                    location: 'Lincoln, NE',
                    gradDate: 'May 2013',
                    degree: 'B.S. Computer Science',
                    minor: 'Mathematics',
                    gpa: '3.96'
                },
                {
                    image: 'images/resume/wsc.png',
                    name: 'Wayne State College',
                    location: 'Wayne, NE',
                    gradDate: 'May 2009',
                    degree: 'B.S. Applied Mathematics',
                    minor: 'Physics',
                    gpa: '3.97'
                }
            ];
        }
    };
});
'use strict';

angular.module('myApp.header', [])

.directive('appHeader', [function() {
    return {
        templateUrl: 'components/header/header.html',
        restrict: 'EA',
        link: function($scope, element, attrs) {

        }
    }
}]);
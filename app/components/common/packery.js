'use strict';

angular.module('myApp.common.packery', [])

.directive('packery', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            // console.log(element);
            $scope.$on('LastRepeaterElement', function(){
                imagesLoaded('#grid-list', function () {
                    element.ready(function() {
                        var packery = new Packery(element[0], {
                            itemSelector: '.grid-item',
                            gutter: 15
                        });
                        packery.layout();
                    });
                });
            });
            
        }
    }
}]);
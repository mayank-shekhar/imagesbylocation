'use strict';

angular.module('myApp.common.pagination', [])

.directive('pagination', ['$window', function($window) {
    return {
        restrict: 'EA',
        scope: {
            pages: '=',
            pageChanged: '&',
            steps: '=',
            currentPage: '='
        },
        controllerAs: 'vm',
        template: [
            '<div class="text-center">',
            '<section class="layout-wrap layout-align-center-center layout-row">',
            '<md-button class="md-icon-button md-raised md-warn" aria-label="First" ng-click="vm.gotoFirst()">{{ vm.first }}</md-button>',
            '<md-button class="md-icon-button md-raised" aria-label="Previous" ng-click="vm.gotoPrev()" ng-show="vm.index - 1 >= 0">&#8230;</md-button>',
            '<md-button class="md-icon-button md-raised" aria-label="Go to page {{i+1}}" ng-repeat="i in vm.stepInfo"',
            ' ng-click="vm.goto(vm.index + i)" ng-show="vm.page[vm.index + i]" ',
            ' ng-class="{\'md-primary\': vm.page[vm.index + i] == currentPage}">',
            ' {{ vm.page[vm.index + i] }}',
            '</md-button>',
            '<md-button class="md-icon-button md-raised" aria-label="Next" ng-click="vm.gotoNext()" ng-show="vm.index + vm.steps < pages">&#8230;</md-button>',
            '<md-button class="md-icon-button md-raised md-warn" aria-label="Last" ng-click="vm.gotoLast()">{{ vm.last }}</md-button>',
            '</section>',
            '<p><md-subheader class="md-primary">Page {{ currentPage }} of {{ pages }}</md-subheader></p>',
            '</div>'
        ].join(''),
        controller: function($scope) {
            var vm = this;

            vm.first = '<<';
            vm.last = '>>';

            vm.index = 0;

            vm.steps = $scope.steps;

            vm.goto = function (index) {
                $scope.currentPage = vm.page[index];
            };

            vm.gotoPrev = function () {
                $scope.currentPage = vm.index;
                vm.index -= vm.steps;
            };

            vm.gotoNext = function () {
                vm.index += vm.steps;
                $scope.currentPage = vm.index + 1;
            };

            vm.gotoFirst = function () {
                vm.index = 0;
                $scope.currentPage = 1;
            };

            vm.gotoLast = function () {
                vm.index = parseInt($scope.pages / vm.steps) * vm.steps;
                vm.index === $scope.pages ? vm.index = vm.index - vm.steps : '';
                $scope.currentPage = $scope.pages;
            };

            $scope.$watch('currentPage', function (value) {
                vm.index = parseInt((value - 1) / vm.steps) * vm.steps;
                $scope.pageChanged();
            });

            $scope.$watch('pages', function () {
                vm.init();
            });

            angular.element($window).bind('resize', function(){
                assignCorrectSteps();
                $scope.$digest();
            });


            vm.init = function () {
                assignCorrectSteps();
                init();
            };

            function init() {
                vm.stepInfo = (function () {
                    var result = [];
                    for (var i = 0; i < vm.steps; i++) {
                        result.push(i)
                    }
                    return result;
                })();

                vm.page = (function () {
                    var result = [];
                    for (var i = 1; i <= $scope.pages; i++) {
                        result.push(i);
                    }
                    return result;
                })();
            }

            function assignCorrectSteps() {
                var width = $window.innerWidth;

                if(width > 1024) {
                    vm.steps = 12;
                } else if(width > 768 && width < 1024) {
                    vm.steps = 8;
                } else if(width > 640 && width < 768) {
                    vm.steps = 5;
                } else if(width > 480 && width < 640) {
                    vm.steps = 3;
                } else {
                    vm.steps = 2;
                }
                init();
            }
        }
    }
}]);
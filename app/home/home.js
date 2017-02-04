'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])

.controller('HomeCtrl', ['Flickr', '$scope', '$routeParams', '$location', '$rootScope', '$window',
    function(Flickr, $scope, $routeParams, $location, $rootScope, $window) {

        if($window.localStorage.getItem('flickr_auth_token') !== null) {
            $rootScope.isLoggedIn = true;
            $location.path('/map');
            return;
        } else {
            $rootScope.isLoggedIn = false;
        }

        $scope.startAuth = function () {
            Flickr.login();
        };


        if(angular.isDefined($routeParams.frob)) {
            Flickr.getAuthToken($routeParams.frob);
        }

    
}]);
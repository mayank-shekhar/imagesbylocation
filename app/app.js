'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngMaterial',
    'ngMap',  
    'myApp.home',
    'myApp.mapView',
    'myApp.common.utils',
    'myApp.flickr',
    'myApp.header',
    'myApp.common.packery',
    'myApp.common.pagination',
    'myApp.common.emitLastRepeaterElement'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        })
        .when('/map', {
            templateUrl: 'mapView/mapView.html',
            controller: 'MapViewCtrl'
        })
        .otherwise({redirectTo: '/home'});
}]);

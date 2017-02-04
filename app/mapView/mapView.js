'use strict';

angular.module('myApp.mapView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/map', {
        templateUrl: 'mapView/mapView.html',
        controller: 'MapViewCtrl'
    });
}])

.controller('MapViewCtrl', ['$scope', '$rootScope', '$mdDialog', 'Flickr', 'NgMap', '$routeParams', '$location', '$window', 'utils',
    function($scope, $rootScope, $mdDialog, Flickr, NgMap, $routeParams, $location, $window, utils) {
    
    var showAlert = function(ev) {        
        var confirm = $mdDialog.confirm()
            .clickOutsideToClose(false)
            .title('Location Error')
            .textContent('Location Service Unavailable. Click Refresh to Try again and grant permission.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Refresh!')
            .cancel('Sounds like a scam')
            .targetEvent(ev);
        
        $mdDialog.show(confirm).then(function() {
            location.reload();
        }, function() {
            $window.localStorage.removeItem('flickr_auth_token');
            $location.path('/home');
        });
    };

    $scope.photos = [];
    $scope.currentPhoto = null;
    $scope.prevPhoto = null;
    $scope.nextPhoto = null;
    $scope.currentPhotoSrc = '';
    $scope.text = '';
    $scope.modalOpened = null;
    $scope.page = 1;
    $scope.search = function(latitude, longitude, page) {
        var coord = utils.verifyCoordinates(latitude, longitude);
        $scope.error = coord;
        if(coord.error) {
            return;
        }
        $scope.loading = true;
        var promise = Flickr.search(latitude, longitude, page);
        promise.then(function(data) {
            $scope.photos = data.photos.photo;
            $scope.page = data.photos.page;
            $scope.pages = data.photos.pages;
            $scope.total = data.photos.total;
            $scope.loading = false;
        }, function(err) {
            console.log('Failed: ' + err);
            $scope.loading = false;
        });
    };

    $scope.openImage = function(url, ev) {
        $mdDialog.show({
            controller: DialogController,
            template: 
                '<md-dialog aria-label="Image Dialog">' +
                '   <md-dialog-content>'+
                '       <img class="img-responsive" data-ng-src="{{url}}" />'+
                '   </md-dialog-content>' +
                '   <md-dialog-actions>' +
                '       <md-button ng-click="closeDialog()" class="md-primary">' +
                '           Close' +
                '       </md-button>' +
                '   </md-dialog-actions>' +
                '</md-dialog>',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen,
            locals: {
                url: url
            }
        })
        .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
        function DialogController($scope, $mdDialog, url) {
            $scope.url = url;
            $scope.closeDialog = function() {
                $mdDialog.hide();
            }
        }
    }
    $scope.loading = true;

    $scope.map = {
        lat: -999,
        lng: -999
    };

    $scope.marker = {
        lat: -999,
        lng: -999
    };

    var map;

    NgMap.getMap().then(function(evtMap) {
        map = evtMap;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude || 55.45,
                    lng: position.coords.longitude || 42.85
                };
                $scope.mapCenter = pos.lat+','+pos.lng;
                $scope.markerPosition = pos.lat+','+pos.lng;
                $scope.marker = {
                    lat: utils.getFixedDecimal(pos.lat, 6),
                    lng: utils.getFixedDecimal(pos.lng, 6)
                };
                map.setCenter(pos);
                $scope.search($scope.marker.lat, $scope.marker.lng);
            }, function() {
                handleLocationError(true, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, map.getCenter());
        }
    });


    function moveMarker(lat, lng) {
        $scope.markerPosition = lat+','+lng;
    }

    $scope.changeMarkerPosition = function(latitude, longitude) {
        var pos = {
            lat: utils.getFixedDecimal(latitude, 6),
            lng: utils.getFixedDecimal(longitude, 6),
        }
        $scope.error = utils.verifyCoordinates(latitude, longitude);
        if($scope.error.error) {
            return;
        } else {
            map.setCenter(pos);
            moveMarker(pos.lat, pos.lng);
            $scope.search(pos.lat, pos.lng, $scope.page);
        }
    };

    function handleLocationError(browserHasGeolocation, pos) {
        showAlert();
    }

    $scope.dragEnd = function(event) {
        var pos = event.latLng;
        $scope.marker = {
            lat: utils.getFixedDecimal(pos.lat(), 6),
            lng: utils.getFixedDecimal(pos.lng(), 6)
        };
        $scope.search($scope.marker.lat, $scope.marker.lng);
    };

    $scope.mapDragEnd = function(event) {
        var pos = map.center;
        $scope.marker = {
            lat: utils.getFixedDecimal(pos.lat(), 6),
            lng: utils.getFixedDecimal(pos.lng(), 6)
        };
        $scope.search($scope.marker.lat, $scope.marker.lng);
        moveMarker($scope.marker.lat, $scope.marker.lng);
    }
    if($window.localStorage.getItem('flickr_auth_token') !== null) {
        $rootScope.isLoggedIn = true;
    } else {
        $location.path('/home');
    }
}]);
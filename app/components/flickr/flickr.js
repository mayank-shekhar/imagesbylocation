'use strict';

angular.module('myApp.flickr', [])

.factory('Flickr', ['$q', '$http', '$rootScope', '$window', '$location', function($q, $http, $rootScope, $window, $location) {
    var self = this;
    self.perPage =  20;
    self.api_key = "f9421ef75a2ec49f9abd3b5d606554b3";
    self.shared_secret = "207b52fc2f3a4f1d";
    self.perms = "read";
    self.auth_token = $window.localStorage.getItem('flickr_auth_token') !== null ? $window.localStorage.getItem('flickr_auth_token') : "" ;
    self.base_url= "https://api.flickr.com/services/rest/";
    self.api_sig = self.shared_secret + 'api_key' + self.api_key + 'perms' + self.perms;
    self.login_link = "http://flickr.com/services/auth/?api_key="+self.api_key+"&perms="+self.perms+"&api_sig="+md5(self.api_sig);

    self.search = function(latitude, longitude, page){
        var deferred = $q.defer();
        var hasParams = latitude !== null && longitude !== null;
        self.page = (page != null && page > 0) ? page : 1;

        var params = {
            api_key: self.api_key,
            per_page: self.perPage,
            format: 'json',
            nojsoncallback: 1,
            page: self.page,
            extras: 'url_m',
            method: (hasParams) ? 'flickr.photos.geo.nearbyForPoint' : 'flickr.photos.getRecent',
            safe_search: 1,
        };

        if (hasParams) {
            params['lat'] = latitude;
            params['lon'] = longitude;
            params['accuracy'] = 1;
            
        }

        if($rootScope.isLoggedIn) {
            params['auth_token'] = self.auth_token;
            var signature = self.shared_secret+
                'accuracy1'+
                'api_key'+self.api_key+
                'auth_token'+self.auth_token+
                'extrasurl_m'+
                'formatjson'+
                'lat'+latitude+
                'lon'+longitude+
                'methodflickr.photos.geo.nearbyForPoint'+
                'nojsoncallback1'+
                'page'+self.page+
                'per_page'+self.perPage+
                'safe_search1';

            params['api_sig'] = md5(signature);
            console.log('comes here');

            $http({method: 'GET', url: self.base_url, params: params}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                    console.log('adwadw');
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(status);
                });
        }
        

        return deferred.promise;

    }

    self.login = function() {
        window.location = self.login_link;
    }

    self.getAuthToken = function (frob) {
        var deferred = $q.defer();
        var signature = self.shared_secret+'api_key'+self.api_key+'frob'+frob+'methodflickr.auth.getToken';
        var params = {
            method: 'flickr.auth.getToken',
            api_key: self.api_key,
            frob: frob,
            api_sig: md5(signature)
        };
        $http({method: 'GET', url: self.base_url, params: params}).
            success(function(data, status, headers, config) {
                var token = data.match(/<token>(.*?)<\/token>/) ? data.match(/<token>(.*?)<\/token>/)[1] : null;
                if(token) {
                    $rootScope.isLoggedIn = true;
                    self.auth_token = token.toString();
                    $window.localStorage.setItem('flickr_auth_token', token.toString());
                    $location.path('/map', {});
                }                
                deferred.resolve(data);
            }).
            error(function(data, status, headers, config) {
                $rootScope.isLoggedIn = false;
                alert(data);
                deferred.reject(status);
            })
    };

    return this;
}]);

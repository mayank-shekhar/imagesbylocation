
'use strict';

angular.module('myApp.common.utils', [])

.service('utils', [function() {
    this.getFixedDecimal = function(number, digits) {
        var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
            m = number.toString().match(re);
        return m ? parseFloat(m[1]) : number.valueOf();
    };

    this.verifyCoordinates = function(lat, lng) {
        var err = {
            lat: null,
            lng: null,
            error: false
        };
        if( !(lat >= -90 && lat <=90)) {
            err.lat = 'Wrong Latitude Entered';
            err.error = true;
        }
        if(!(lng >= -180 && lng <=180)) {
            err.lng = 'Wrong Longitude Entered';
            err.error = true;
        }
        return err;
    }
}
]);
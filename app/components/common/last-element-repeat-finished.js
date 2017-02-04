'use strict';

angular.module('myApp.common.emitLastRepeaterElement', [])

.directive('emitLastRepeaterElement', function() {
    return function(scope) {
        if (scope.$last){
            setTimeout(function() {
                scope.$emit('LastRepeaterElement');
            });            
        }
    };
});
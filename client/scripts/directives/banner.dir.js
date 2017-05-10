angular.module('myApp', []).directive('banner', function() {
    return function (scope, element, attrs) {
        element.height($(window).height() - $('.header').outerHeight());
    }
});
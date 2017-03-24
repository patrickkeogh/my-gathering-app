// Forked from: https://gist.github.com/melbourne2991/8822609
//
// Below is an example of a directive that let's other directives know when there has been a change 
// in a breakpoint, as well as a windows resize, the event is triggered on the window resize and 
// broadcast on $rootScope. The arguments contain the current & previous breakpoints. Previous will 
// be null if there is yet to be a change in breakpoint.
//

angular.module('myGathering')
    .directive('breakpointWatcher', breakpointWatcher);

breakpointWatcher.$inject = ['$window', '$rootScope', '$timeout'];

function breakpointWatcher($window, $rootScope, $timeout) {

    return {
        controller: function() {
            var getBreakpoint = function() {
                var windowWidth = $window.innerWidth;
                if(windowWidth < 768) {
                        return 'extra small';
                    } else if (windowWidth >= 768 && windowWidth < 992) {
                        return 'small';
                    } else if (windowWidth >= 992 && windowWidth < 1200) {
                        return 'medium';
                    } else if (windowWidth >= 1024) {
                        return 'large';
                    }   
                };  

                var currentBreakpoint = getBreakpoint();
                var previousBreakpoint = null;

                // Broadcast inital value, so other directives can get themselves setup
                $timeout(function() {
                    console.log('Broadcast inital value, so other directives can get themselves setup');
                    $rootScope.$broadcast('windowResize', currentBreakpoint, previousBreakpoint);
                }); 

                angular.element($window).bind('resize', function() {
                    var newBreakpoint = getBreakpoint();

                    if (newBreakpoint != currentBreakpoint) {
                        previousBreakpoint = currentBreakpoint;
                        currentBreakpoint = newBreakpoint;
                    }   

                    $rootScope.$broadcast('windowResize', currentBreakpoint, previousBreakpoint);
                }); 
            }
        };

    }


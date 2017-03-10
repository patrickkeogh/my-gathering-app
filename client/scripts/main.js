(function() {
    'use strict';
    
    angular
    .module('myGathering', [
      'ui.router',
      'ngCookies'
    ])
    .config(config)
    .constant('Constants', {
        HEROKU_URL: 'https://my-gathering.herokuapp.com'
    })
    .run(run);
    
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    run.$inject = ['$rootScope', '$location', 'Authentication'];
    
    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        //$httpProvider.interceptors.push('authInterceptor');
    
        $stateProvider
        .state('main', {
            url:'/',
            views: {
                'header': {
                    templateUrl: './views/nav.header.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: './views/main.html',
                    controller: 'MainController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: false
        });
    }

    function run($rootScope, $location, Authentication) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {
            console.log("We have a state change");
          
            if (next.authenticate) {
                console.log("Authentication is required");
                if(!Authentication.isLoggedIn()) {
                    console.log("User is not Authenticated");
                    $location.path('/login');
                }
            }
         
        });
    }
    
})();
(function() {
    'use strict';
    
    angular
    .module('myGathering', [
      'ui.router',
      'ngCookies',
      'ngAutocomplete',
      'angular-momentjs',
      'ui.bootstrap',
      'uiGmapgoogle-maps',
      'angular-filepicker',
      'angular-img-cropper',
      'underscore',
      'angucomplete-alt'

    ])
    .config(config)
    .constant('Constants', {
        HEROKU_URL: 'https://my-gathering.herokuapp.com',
        TOKEN_ID: 'myGathering-token',
        LOCATION_ID: 'myGathering-locations',
        ENV: 'false'
    })
    .run(run);
    
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'uiGmapGoogleMapApiProvider', 'filepickerProvider'];
    run.$inject = ['$rootScope', '$location', 'Authentication'];
    
    function config($stateProvider, $urlRouterProvider, $locationProvider, uiGmapGoogleMapApiProvider, filepickerProvider) {
        $urlRouterProvider.otherwise('/');
        //$locationProvider.html5Mode(true);
        //$httpProvider.interceptors.push('authInterceptor');
        filepickerProvider.setKey('ANNrSlVqZSbCvpZVLcwspz');

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAf7uV3v7upRbATDfluOmSaoHMgsgXRkDM',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'geometry'
        });
    
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
        })
        // route for gathering search
        .state('search', {
            url: '/search',
            views: {
                'header': {
                    templateUrl: './views/nav.header.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: './views/search.html',
                    controller: 'SearchController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            data: {
                requireLogin: true
            }

        });
    }

    function run($rootScope, $location, Authentication) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {
            //console.log("We have a state change");
          
            if (next.authenticate) {
                //console.log("Authentication is required");
                if(!Authentication.isLoggedIn()) {
                    //console.log("User is not Authenticated");
                    $location.path('/login');
                }
            }
         
        });
    }
    
})();
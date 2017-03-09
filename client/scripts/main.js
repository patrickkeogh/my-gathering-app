// (function () {

//   angular.module('myGathering', ['ngRoute']);

//   function config ($routeProvider, $locationProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'home/home.view.html',
//         controller: 'homeCtrl',
//         controllerAs: 'vm'
//       })
//       .when('/register', {
//         templateUrl: '/auth/register/register.view.html',
//         controller: 'registerCtrl',
//         controllerAs: 'vm'
//       })
//       .when('/login', {
//         templateUrl: '/auth/login/login.view.html',
//         controller: 'loginCtrl',
//         controllerAs: 'vm'
//       })
//       .when('/profile', {
//         templateUrl: '/profile/profile.view.html',
//         controller: 'profileCtrl',
//         controllerAs: 'vm'
//       })
//       .otherwise({redirectTo: '/'});

//     // use the HTML5 History API
//     $locationProvider.html5Mode(true);
//   }

//   // function run($rootScope, $location, authentication) {
//   //   $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
//   //     if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
//   //       $location.path('/');
//   //     }
//   //   });
//   // }
  
//   angular
//     .module('myGathering')
//     .config(['$routeProvider', '$locationProvider', config]);

// })();

(function() {
    'use strict';
    
    angular
    .module('myGathering', [
      'ui.router',
      'ngCookies'
    ])
    .config(config);
    
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    
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
            }
        });
    }
    
})();
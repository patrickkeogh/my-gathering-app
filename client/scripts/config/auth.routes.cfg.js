(function() {
  'use strict';

  angular
    .module('myGathering')
    .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
      $stateProvider
        .state('login', {
            url:'/login',
            views: {
                'header': {
                    templateUrl: './views/nav.header.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: './views/login.html',
                    controller: 'MainController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            }
        })
        .state('register', {
            url:'/register',
            views: {
                'header': {
                    templateUrl: './views/nav.header.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: './views/register.html',
                    controller: 'AuthController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }


            }
        });
    }

})();
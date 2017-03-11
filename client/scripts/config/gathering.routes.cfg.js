(function() {
  'use strict';

  angular
    .module('myGathering')
    .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
      $stateProvider
        .state('gathering-create', {
            url: '/gathering/create',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.create.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.create.html',
                    controller: 'CreateGatheringController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        });
    }

})();
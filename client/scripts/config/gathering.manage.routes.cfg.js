(function() {
  'use strict';

  angular
    .module('myGathering')
    .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider
        .state('gathering-manage-banner', {
            url: '/gathering/banner/:id',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.manage.banner.html',
                    controller: 'GatheringChat as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        });
    }

})();
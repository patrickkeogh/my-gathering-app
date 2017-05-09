(function() {
  'use strict';

  angular
    .module('myGathering')
    .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider
        .state('gathering-new', {
            url: '/gathering/new',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.new.html',
                    controller: 'NewGatheringController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        })
        .state('gathering-created', {
            url: '/gathering/created',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.created.html',
                    controller: 'GatheringsCreatedController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        })
        .state('gathering-joined', {
            url: '/gathering/joined',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.joined.html',
                    controller: 'CreateGatheringController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        })
        .state('gathering-dashboard', {
            url: '/gathering/dashboard/:id',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.dashboard.html',
                    controller: 'GatheringDashboardController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        })
        .state('gathering-info', {
            url: '/gathering/info/:id',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.info.html',
                    controller: 'GatheringInfoController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        })
        .state('gathering-pics', {
            url: '/gathering/pics/:id',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.pictures.html',
                    controller: 'GatheringChatController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        })

        .state('gathering-chat', {
            url: '/gathering/chat/:id',
            views: {
                'header': {
                    templateUrl: 'views/nav.header.sidebar.html',
                    controller: 'NavigationController as vm'
                },
                'content': {
                    templateUrl: 'views/gathering.chat.html',
                    controller: 'GatheringChatController as vm'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            },
            authenticate: true

        });
    }

})();
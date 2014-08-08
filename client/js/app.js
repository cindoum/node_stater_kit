'use strict';

angular.module('angular-client-side-auth', ['ui.bootstrap', 'ngCookies', 'ui.router', 'ngSanitize', 'restangular', 'toastr'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    // Public routes
    $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.public
            }
        })
        .state('public.home', {
            url: '/',
            templateUrl: 'home',
            controller: 'HomeCtrl'
        })
        .state('public.404', {
            url: '/404/',
            templateUrl: '404'
        });

    // Anonymous routes
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.anon
            }
        })
        .state('anon.login', {
            url: '/login/',
            templateUrl: 'login',
            controller: 'LoginCtrl'
        })
        .state('anon.register', {
            url: '/register/',
            templateUrl: 'register',
            controller: 'RegisterCtrl'
        });

    // Regular user routes
    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.user
            }
        })
        .state('user.private', {
            abstract: true,
            url: '/private/',
            templateUrl: 'private/layout'
        })
        .state('user.private.home', {
            url: '',
            templateUrl: 'private/home'
        })
        .state('user.private.nested', {
            url: 'nested/',
            templateUrl: 'private/nested'
        })
        .state('user.private.admin', {
            url: 'admin/',
            templateUrl: 'private/nestedAdmin',
            data: {
                access: access.admin
            }
        })
        .state('user.chat', {
            url: '/chat/',
            templateUrl: 'chat',
            controller: 'ChatCtrl'
        });

    // Admin routes
    $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.admin
            }
        })
        .state('admin.admin', {
            url: '/admin/',
            templateUrl: 'admin',
            controller: 'AdminCtrl',
            resolve: {
                users: function (Restangular) {
                    return Restangular.one('users').getList();
                }
            }
        });


    $urlRouterProvider.otherwise('/404');

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function($injector, $location) {
        if($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function(v, k){
            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403 && response.config.url.indexOf('register') == -1) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

}])

.factory('$exceptionHandler', ['$log', function ($log) {
    return function (exception, cause) {
        $log.error(exception);
    };
}])

.run(['$rootScope', '$state', 'Auth', 'notif', 'localize', function ($rootScope, $state, Auth, notif, localize) {
    var toast;
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (!Auth.authorize(toState.data.access)) {
            notif.error('Vous ne pouvez pas allez la!', localize.getLocalizedString('errtitle'));
            event.preventDefault();
            
            if(Auth.isLoggedIn()) {
                $state.go('public.home');
            } else {
                $state.go('anon.login');
            }
            
            notif.clear(toast);
        }
        else {
            toast = notif.wait(localize.getLocalizedString('waitwhileloading'), localize.getLocalizedString('loading'));
        }
    });
    
    $rootScope.$on('$stateChangeSuccess', function (event, next, current) {
        if (toast != null) {
            notif.clear(toast);
        }
    });
    
    $rootScope.$on('$stateChangeError', function (event, next, current) {
        if (toast != null) {
            notif.clear(toast);
        }
    });

}]);

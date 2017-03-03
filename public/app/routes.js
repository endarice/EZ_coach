angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/pages/home.html',
            authenticated: true
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/register', {
            templateUrl: 'app/views/pages/users/register.html',
            controller: 'regCtrl',
            controllerAs : 'register',
            authenticated: false
        })
        .when('/login', {
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false
        })
        .when('/logout', {
            templateUrl: 'app/views/pages/users/logout.html',
            authenticated: true
        })
        .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html',
            authenticated: true
        })
        .when('/createTeam', {
            templateUrl: 'app/views/pages/users/teams/createTeam.html',
            controller: 'createTeamCtrl',
            controllerAs: 'createTeam',
            authenticated: true
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({enabled: true, requireBase: false});
})

.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(next.$$route.authenticated) {
            if(!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/login');
            }
        } else if (next.$$route.authenticated == false) {
            if(Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        }
    });
}]);
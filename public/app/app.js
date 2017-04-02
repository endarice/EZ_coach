angular.module('userApp', ['appRoutes','userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'teamControllers', 'teamServices', 'memberController', 'ng-fusioncharts', 'mwl.calendar'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
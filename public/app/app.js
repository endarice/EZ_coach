angular.module('userApp', ['appRoutes','userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'teamControllers', 'teamServices', 'memberController', 'ng-fusioncharts'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
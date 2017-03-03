angular.module('userApp', ['appRoutes','userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'teamControllers', 'teamServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
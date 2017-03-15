angular.module('authServices', [])

.factory('Auth', function($http, AuthToken) {
    authFactory = {};

    authFactory.login = function(loginData) {
        return $http.post('api/authenticate', loginData).then(function (data) {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };
    authFactory.logout = function() {
        AuthToken.setToken();
    };
    authFactory.isLoggedIn = function() {
        if(AuthToken.getToken()) {
            return true
        } else {
            return false
        }
    };
    authFactory.getProfile = function(){
        if(AuthToken.getToken()) {
            return $http.post('api/profile');
        } else {
            $q.reject({ message: 'User has no token'})
        }
    };
    authFactory.getTeams = function() {
        if(AuthToken.getToken()) {
            return $http.post('api/getTeams');
        } else {
            $q.reject({ message: 'User has no token'})
        }
    };
    authFactory.getTeam = function(teamname) {
        if(AuthToken.getToken()) {
            return $http.post('api/getTeam', {"name": teamname});
        } else {
            $q.reject({ message: 'User has no token'})
        }
    };
    authFactory.getMembers = function(id) {
        if(AuthToken.getToken()) {
            return $http.post('api/getMembers', {"id": id});
        } else {
            $q.reject({ message: 'User has no token'})
        }
    };
    return authFactory;
})

.factory('AuthToken', function($window) {
    var authToken = {};
    authToken.setToken = function (token) {
        if (token) {
        $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };
    authToken.getToken = function () {
        return $window.localStorage.getItem('token');
    };
    return authToken;
})

.factory('AuthInterceptors', function (AuthToken) {
    var authIntercept = {};

    authIntercept.request = function(config) {
        var token = AuthToken.getToken();
        if(token) config.headers['x-access-token'] = token;
        return config;
    };
    return authIntercept;
});
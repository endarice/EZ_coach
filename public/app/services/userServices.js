angular.module('userServices', [])

.factory('User', function($http) {
    userFactory = {};
    userFactory.create = function(regData) {
        return $http.post('api/Users', regData);
    };
    return userFactory;
});
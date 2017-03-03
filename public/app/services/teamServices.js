angular.module('teamServices', [])

.factory('Team', function($http) {
    teamFactory = {};
    teamFactory.create = function(teamData) {
        return $http.post('api/createTeam', teamData);
    };
    return teamFactory;
});
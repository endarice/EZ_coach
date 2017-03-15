angular.module('teamServices', [])

.factory('Team', function($http) {
    teamFactory = {};
    teamFactory.create = function(teamData) {
        return $http.post('api/createTeam', teamData);
    };
    teamFactory.addMember = function(memberData) {
        return $http.post('api/addMember', memberData);
    };
    return teamFactory;
});
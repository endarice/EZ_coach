angular.module('teamServices', [])

.factory('Team', function($http) {
    teamFactory = {};
    teamFactory.create = function(teamData) {
        return $http.post('api/createTeam', teamData);
    };
    teamFactory.addMember = function(memberData) {
        return $http.post('api/addMember', memberData);
    };
    teamFactory.addPerformanceData = function(performanceData) {
        return $http.post('api/addPerformanceData', {performanceData: performanceData});
    };
    teamFactory.addValues = function(performanceValues) {
        return $http.post('api/addPerformanceValues', {performanceValues: performanceValues});
    };
    return teamFactory;
});
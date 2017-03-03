angular.module('teamControllers', ['teamServices'])

.controller('createTeamCtrl', function($http, $location, Team){
    var app = this;
    this.createTeam = function(teamData) {
        app.loading = true;
        app.errorMsg = false;
        Team.create(app.teamData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
                $location.path('/');
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    };
});
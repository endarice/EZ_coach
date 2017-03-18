angular.module('teamControllers', ['teamServices'])

.controller('teamCtrl', function($http, $location, $route, Team){
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

    this.addTeamMember = function(memberData) {
        app.loading = true;
        app.errorMsg = false;
        Team.addMember(app.memberData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
                $route.reload();
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    };

    this.addData = function(performanceData) {
        app.loadingD = true;
        app.errorMsg = false;
        console.log(app.performanceData);
        Team.addPerformanceData(app.performanceData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if(data.data.success) {
                app.loadingD = false;
                app.successMsg = data.data.message;
                $route.reload();
            } else {
                app.loadingD = false;
                app.errorMsg = data.data.message;
            }
        })
    }
});
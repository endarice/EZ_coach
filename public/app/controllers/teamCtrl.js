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
        app.errorMsgD = false;
        console.log(app.performanceData);
        Team.addPerformanceData(app.performanceData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if(data.data.success) {
                app.loadingD = false;
                app.successMsgD = data.data.message;
                $route.reload();
            } else {
                app.loadingD = false;
                app.errorMsgD = data.data.message;
            }
        })
    };

    this.addValues = function(performanceValues) {
        app.loadingV = true;
        app.errorMsg = false;
        console.log(app.performanceValues);
        Team.addValues(app.performanceValues).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if(data.data.success) {
                app.loadingV = false;
                app.successMsg = data.data.message;
                $route.reload();
            } else {
                app.loadingV = false;
                app.errorMsg = data.data.message;
            }
        })
    };
});
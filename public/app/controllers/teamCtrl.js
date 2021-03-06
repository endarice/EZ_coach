angular.module('teamControllers', ['teamServices'])

.controller('teamCtrl', function($http, $location, $routeParams, Team, Auth, calendarConfig, moment, $scope) {
    var app = this;

    $scope.events = [
        {
            title: 'Editable event',
            color: calendarConfig.colorTypes.warning,
            startsAt: moment().startOf('month').toDate(),
            actions: [{
                label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                onClick: function(args) {
                    alert.show('Edited', args.calendarEvent);
                }
            }]
        }
    ];

    $scope.viewDate = moment().startOf('month').toDate();
    $scope.cellIsOpen = true;

    app.name = $routeParams.team_name;
    Auth.getTeam(app.name).then(function (team) {
        app.team = team.data;
        Auth.getMembers(app.team._id).then(function (members) {
            app.members = members.data;
        })
    });

    this.addEvent = function() {
        $scope.events.push({
            title: 'New event',
            startsAt: moment().startOf('day').toDate(),
            endsAt: moment().endOf('day').toDate(),
            color: calendarConfig.colorTypes.important,
            draggable: true,
            resizable: true
        });
    };

    this.goToMember = function(member) {
        $location.path('/showTeam/'+app.team.name+'/showMember/'+member._id);
    };

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
});
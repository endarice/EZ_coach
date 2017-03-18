angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $location, $timeout, $rootScope) {
    var app = this;

    app.loadme = false;

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            app.name = next.pathParams.team_name;
            app.membername = next.pathParams.member_name;
            Auth.getTeam(app.name).then(function (team) {
                app.team = team.data;
                Auth.getMembers(app.team._id).then(function (members) {
                    app.members = members.data;
                })
            });
            Auth.getMember(app.membername). then(function (member) {
                app.member = member.data
            });
            Auth.getProfile().then(function(data) {
                app.username = data.data.username;
                app.email = data.data.email;
                app.loadme = true;
            });
            Auth.getTeams().then(function(teamData) {
                app.teamData = teamData.data;
            });
        } else {
            app.username = null;
            app.isLoggedIn = false;
            app.loadme = true;
        }
    });

    this.goToMember = function(member) {
        $location.path('/showTeam/'+app.team.name+'/showMember/'+member._id);
    };

    this.login = function(loginData) {
        app.loading = true;
        app.errorMsg = false;
        Auth.login(app.loginData).then(function(data) {
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
                $location.path('/');
                app.loginData = null;
                app.successMsg = false;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    };

    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/');
        }, 2000);
    };
});

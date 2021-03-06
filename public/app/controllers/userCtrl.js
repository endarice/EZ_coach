angular.module('userControllers', ['userServices', 'authServices'])

.controller('regCtrl', function($http, $location, User, Auth){
    var app = this;
    this.regUser = function(regData) {
        app.loading = true;
        app.errorMsg = false;
        User.create(app.regData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
                //Auth.login(app.regData);
                $location.path('/home');
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    };
});
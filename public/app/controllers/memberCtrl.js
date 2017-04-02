angular.module('memberController', ['authServices'])

.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], scope.options);
            scope.$watch('options', function(newVal) {
                if (newVal) {
                    Highcharts.chart(element[0], scope.options);
                }
            }, true);
        }
    };
})

.controller('memberCtrl', function(Auth, $http, $location, $routeParams, $route, Team) {
    var app = this;

    app.chartOptions = {};

    app.chartOptions.xAxis = {
        type: 'datetime',
        dateTimeLabelFormats: {
            month: '%e. %b',
            year: '%e. %b'
        },
        title: {
            text: 'Date'
        }
    };

    app.currentItem = null;

    app.membername = $routeParams.member_name;
    Auth.getMember(app.membername). then(function (member) {
        app.member = member.data;
        console.log(app.member);
        app.setTempItem(app.member.performanceData[0]);
    });

    this.setTempItem = function(item) {
        app.currentItem = item;
        app.setDataSource(app.currentItem);
    };

    this.setDataSource = function(currItem) {
        app.dataArray = [];
        currItem.value.sort(function(a, b) {
            return (a.date < b.date) ? -1 : ((a.date > b.date) ? 1 : 0);
        });
        currItem.value.forEach(function (value) {
            var year = new Date(value.date).getFullYear();
            var month = new Date(value.date).getMonth();
            var day = new Date(value.date).getDate();
            app.dataArray.push(
                [Date.UTC(year, month, day), value.data]
            );
        });
        app.chartOptions.title = {
                text: currItem.type
        };
        app.chartOptions.yAxis = {
            title: {
                text: currItem.units
            }
        };
        app.chartOptions.series = [{name: currItem.type, data: app.dataArray}];
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
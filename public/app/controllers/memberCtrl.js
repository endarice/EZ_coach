angular.module('memberController', ['authServices'])

.controller('memberCtrl', function(Auth, $http, $location, $routeParams, $route, Team) {
    var app = this;

    // app.chart = {
    //     "caption": "Sales - 2012 v 2013",
    //     "numberprefix": "$",
    //     "plotgradientcolor": "",
    //     "bgcolor": "FFFFFF",
    //     "showalternatehgridcolor": "0",
    //     "divlinecolor": "CCCCCC",
    //     "showvalues": "0",
    //     "showcanvasborder": "0",
    //     "canvasborderalpha": "0",
    //     "canvasbordercolor": "CCCCCC",
    //     "canvasborderthickness": "1",
    //     "yaxismaxvalue": "30000",
    //     "captionpadding": "30",
    //     "linethickness": "3",
    //     "yaxisvaluespadding": "15",
    //     "legendshadow": "0",
    //     "legendborderalpha": "0",
    //     "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    //     "showborder": "0"
    // };

    app.chart = {};
    app.categories = [];
    app.dataset = [];

    app.currentItem = null;
    app.dataSource = {
        chart: {caption: ""} ,
        data: {value: ""}
    };

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
        app.catArray = [];
        currItem.value.forEach(function (value) {
            app.dataArray.push({
               "value": value.data
            });
            app.catArray.push({
                "label": value.date
            });
        });
        app.chart = {caption: currItem.type,
                     numberSuffix: currItem.units};
        app.categories = [{category: app.catArray}];
        app.dataset = [{data: app.dataArray}];
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
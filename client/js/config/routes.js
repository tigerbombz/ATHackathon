var myApp = angular.module("myApp", ["ngRoute", "ui.bootstrap"]);

myApp.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '../static/partials/homepage.html'
    })

    .otherwise({
      redirectTo: "/"
    });
});

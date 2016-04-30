var myApp = angular.module("myApp", ["ngRoute", "ui.bootstrap"]);

myApp.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '../static/partials/homepage.html'
    })
     .when('/location', {
       templateUrl: '../static/partials/location.html'
     })
    .otherwise({
      redirectTo: "/"
    });
});

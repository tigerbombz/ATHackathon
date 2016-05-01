var app = angular.module('googlemap-demo', ['sesu.angular.googlemap']);

app.controller('MainCtrl', function($scope) {
  $scope.name = 'World';
  $scope.items = [
    {
      latitude: "25.34808419808938",
      longitude: "55.401626320164496",
      title: "hi"
    },
    {
      latitude: "24.3728260",
      longitude: "54.5415901",
      title: "hello"
    },
    {
      latitude: "24.3728699",
      longitude: "56.5446371",
      title: "welcome"
    }];

  $scope.onMarkersAdded = function(){
    console.log("markers added");
  };
});

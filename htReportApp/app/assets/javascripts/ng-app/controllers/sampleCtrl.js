angular.module('sampleApp')
.controller('sampleCtrl', [
'$scope',
'$state',
function($scope,$state){
  console.log('here')
  $scope.items = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
}])

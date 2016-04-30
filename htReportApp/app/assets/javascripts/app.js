angular.module('sampleApp', ['ui.router','templates'])

.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl:'_test.html',
      controller: 'sampleCtrl'
    })

  $urlRouterProvider.otherwise('/')
});

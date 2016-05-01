angular.module('sampleApp', ['ui.router','ui.bootstrap','templates', 'uiGmapgoogle-maps'])

.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl:'_homepage.html',
      controller: 'sampleCtrl'
    })
    .state('location', {
      url: '/location',
      templateUrl: '_location.html'
    })
    .state('minor', {
      url: '/minor',
      templateUrl: '_minor.html'
    })
    .state('photo', {
      url: '/photo',
      templateUrl: '_photo.html'
    })
    .state('thankyou', {
      url: '/thankyou',
      templateUrl: '_thankyou.html'
    })

  $urlRouterProvider.otherwise('/')
});

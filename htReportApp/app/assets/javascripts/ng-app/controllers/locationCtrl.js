//location controller 
angular.module('sampleApp')
.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})

angular.module('sampleApp')
.controller("locationMapCtrl", function($scope, uiGmapGoogleMapApi){
    var savedLocations = [];
      $scope.polylines = [];
     $scope.map = {
     center: {latitude: 37.784623, longitude: -122.398196 },
     zoom: 14,
     events : function(){
     }
   };

    $scope.marker = {
    id: 0,
    coords: {
      latitude: 37.784623,
      longitude: -122.398196
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {

        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();
        $log.log(lat);
        $log.log(lon);

        var markers = {
          id: Date.now(),
          coords: {
            latitude: lat,
            longitude: lon

            }
          }
        savedLocations.push(markers);
        $scope.savedLocations = savedLocations;
        $scope.marker.options = {
          draggable: true,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };
      }
    }
  };

  uiGmapGoogleMapApi.then(function(maps) {
  });
$scope.click = function() {
  $scope.savedLocations = null;
  };
});









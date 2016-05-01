/**
 * Author:Subash Selvaraj
 * Date: 20-11-2015
 * website: subashselvaraj.com
 * Directive for angular google map wrapper
 * Handle Google Maps API V3+
 * Documentation: https://developers.google.com/maps/documentation/
 *
 */
angular.module('sesu.angular.googlemap',[]).directive("googleMap", function ($window, $http, $templateCache, $compile, $timeout) {
    return {
        restrict: "E",
        replace: true,
        template: "<div data-tap-disabled='true'></div>",
        scope: {
            center: "@", // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "@", // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@", // Map width in pixels.
            height: "@", // Map height in pixels.
            zoom: "=", // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@", // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@", // Whether to show a pan control on the map.
            zoomControl: "@", // Whether to show a zoom control on the map.
            scaleControl: "@", // Whether to show scale control on the map.
            markersWithLabel: "=", // whether markers will have label.
            infoTemplateUrl: "@",
            fitBounds: "=",
            neverPanCenter: "=",
            infoWindow: "=",
            markerIcon: "@",
            onInfoOpen: "&",
            onMarkersAdded: "&"

        },
        link: function (scope, element, attrs) {
            var toResize, toCenter;
            var map;
            var infowindow;
            var currentMarkers;
            var callbackName = 'InitMapCb';

            // callback when google maps is loaded
            $window[callbackName] = function () {
                createMap();
                updateMarkers();
            };

            if (!$window.google || !$window.google.maps) {
                loadGMaps();
            }
            else {
                createMap();
            }

            function loadGMaps() {
                var script = $window.document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=InitMapCb';
                $window.document.body.appendChild(script);
            }

            function createMap() {
                scope.$watch("center", function () {
                    (scope.center.length) ? (scope.center = angular.fromJson(scope.center)) : "";
                    scope.markerIcon = (scope.markerIcon == undefined) ? "https://www.google.com/mapfiles/markerA.png" : scope.markerIcon;

                    if (scope.center.latitude !== undefined) {
                        var mapOptions = {
                            zoom: scope.zoom,
                            center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            panControl: scope.panControl,
                            zoomControl: scope.zoomControl,
                            mapTypeControl: false,
                            scaleControl: scope.scaleControl,
                            streetViewControl: false,
                            navigationControl: true,
                            disableDefaultUI: true,
                            overviewMapControl: true
                        };

                        if (!(map instanceof google.maps.Map)) {
                            map = new google.maps.Map(element[0], mapOptions);

                            map.setCenter(new google.maps.LatLng(scope.center.latitude, scope.center.longitude));
                            // EDIT Added this and it works on android now
                            // Stop the side bar from dragging when mousedown/tapdown on the map
                            google.maps.event.addDomListener(element[0], 'mousedown', function (e) {
                                e.preventDefault();
                                return false;
                            });

                            infowindow = new google.maps.InfoWindow();

                        }
                    }
                });
            }

            scope.$watch('markers', function () {
                console.log("markers");
                updateMarkers();
            });

            function fitBoundsToVisibleMarkers() {

                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < currentMarkers.length; i++) {
                    if (currentMarkers[i].getVisible()) {
                        bounds.extend(currentMarkers[i].getPosition());
                    };
                }

                map.fitBounds(bounds);

            }

            // Info window trigger function
            function onItemClick(pin, label, datum, url, index) {
                $http.get(scope.infoTemplateUrl, {
                    cache: $templateCache
                }).then(function (content) {
                    var compiled, templateScope;
                    templateScope = scope.$new();
                    templateScope.item = angular.fromJson(scope.markers)[index];
                    if (angular.isDefined(scope.templateParameter)) {
                        templateScope.parameter = scope.templateParameter;
                    }
                    compiled = $compile(content.data)(templateScope);
                    infowindow.setContent(compiled[0]);
                });

                infowindow.setPosition(pin.position);
                infowindow.open(map);

                if (typeof scope.onInfoOpen !== "undefined") {
                    scope.onInfoOpen({index: index});
                }

                google.maps.event.addListener(infowindow, 'closeclick', function () {
                    infowindow.close();
                });
            }

            function markerCb(marker, member, location, index) {
                return function () {
                    var href = "";
                    map.setCenter(location);
                    onItemClick(marker, member.title, member.description, href, index);
                };
            }


            // update map markers to match scope marker collection
            function updateMarkers() {
              console.log("markers")
                console.log(scope.markers);
                $timeout(function () {

                    if (map) {
                        var markers = scope.markers;
                        if (angular.isString(markers))
                            markers = scope.$eval(scope.markers);

                        if (markers !== undefined) {
                            if (markers.length !== undefined) {
                                if (currentMarkers !== undefined) {
                                    for (var i = 0; i < currentMarkers.length; i++) {
                                        currentMarkers[i].setMap(null);
                                    }
                                }

                                currentMarkers = [];
                                for (var i = 0; i < markers.length; i++) {
                                    var m = markers[i];
                                    var loc = new google.maps.LatLng(m.latitude, m.longitude);
                                    var mm;

                                    var iconImage = {
                                        url: (m.markerIcon) ? m.markerIcon : scope.markerIcon,
                                        // This marker is 20 pixels wide by 32 pixels tall.
                                        //size: new google.maps.Size(20, 32),
                                        // The origin for this image is 0,0.
                                        origin: new google.maps.Point(0,0),
                                        // The anchor for this image is the base of the flagpole at 0,32.
                                        anchor: new google.maps.Point(15, 15)
                                    };
                                    mm = new google.maps.Marker({
                                        position: loc,
                                        map: map,
                                        title: m.title,
                                        icon: iconImage
                                    });

                                    if (scope.infoWindow)
                                        google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc, i));

                                    currentMarkers.push(mm);
                                }

                            } else {

                                currentMarkers = [];
                                var m = markers;
                                var loc = new google.maps.LatLng(m.latitude, m.longitude);
                                var mm = new google.maps.Marker({
                                    position: loc,
                                    map: map,
                                    title: m.title,
                                    icon: scope.markerIcon
                                });
                                //console.log("map: make marker for " + m.name);
                                if (scope.infoWindow)
                                    google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
                                currentMarkers.push(mm);
                            }
                        }
                    }
                    if(currentMarkers !== undefined){
                      scope.onMarkersAdded();
                      if (scope.fitBounds) {
                          fitBoundsToVisibleMarkers();
                      } else if (currentMarkers.length == 1) {
                          map.setCenter(currentMarkers[0].getPosition());
                          if(scope.neverPanCenter === undefined){
                              var pannedOnce = false;
                              google.maps.event.addListener(map, 'center_changed', function () {
                                  // 3 seconds after the center of the map has changed, pan back to the
                                  // marker.
                                  if(!pannedOnce){
                                      pannedOnce = true;
                                      window.setTimeout(function () {
                                          map.panTo(currentMarkers[0].getPosition());
                                      }, 300);
                                  }
                              });
                          }

                      }
                  }
                }, 1000);
            }

            // convert current location to Google maps location
            function getLocation(loc) {
                if (loc === null)
                    return new google.maps.LatLng(40, -73);
                if (angular.isString(loc))
                    loc = scope.$eval(loc);
                return new google.maps.LatLng(loc.lat, loc.lon);
            }

        } // end of link:
    }; // end of return
})
//=======================================================================
//  Helper filters can be modified based on application's json structure
//=======================================================================
/*
 * latlong
 * @Param object
 */
.filter('latLong', function() {

        return function(obj, type) {
            if(typeof obj != "undefined"){
                var filtered = {};
                if(Array.isArray(obj)){
                    angular.forEach(obj, function(item) {
                        filtered = {latitude:item.latitude, longitude:item.longitude};
                    });
                }else if(Object.getOwnPropertyNames(obj).length !== 0){
                   filtered = {latitude:obj.latitude, longitude:obj.longitude};
                }

                return filtered;
            }

        };
    })
/*
 * markersOptions
 * @Param object
 */
.filter('markersOptions', function() {

    return function(obj) {
        console.log(obj);
        var filtered = [];
        if(typeof obj !== "undefined"){

            if(Array.isArray(obj)){
                angular.forEach(obj, function(item) {
                     filtered.push({description: item.description, title: item.title, latitude:item.latitude, longitude:item.longitude, Details: item.Details});

                });
            }else if(Object.getOwnPropertyNames(obj).length !== 0){

                    filtered.push({description: obj.description, title: obj.title, latitude:obj.latitude, longitude:obj.longitude, Details: obj.Details});

            }
        }
        return filtered;
    };
});

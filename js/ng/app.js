var Cornetto =
	angular.module('GovHack', ['google-maps', 'ui.bootstrap'])

	.controller('InfoController', ['$scope', function($scope) {
		$scope.templateValue = 'hello from the template itself';
		$scope.clickedButtonInWindow = function () {
			var msg = 'clicked a window in the template!';
			alert(msg);
		};
	}])

	.controller('ZombieCtrl', ['$scope', '$timeout', '$q', '$http', '$modal', function($scope, $timeout, $q, $http, $modal) {
		var positive = ['police', 'vic_pubs'],
				positivePromises = [],
				negative = ['cemeteries', 'hospitals'],
				negativePromises = [];
		var loadingMessages = [
			'Assembling Team',
			'Reticulating Splines',
			'Loading threat data',
			'Calculating escape route',
			'Killing Phil',
			'You\'ve got red on you',
			'Cornetto?',
			'Searching..',
			'There\'s one behind you'
		];

		// Don't know what this does, but i was in the demoI was told to do it.
		// See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
		google.maps.visualRefresh = true;

		// Stuff happens here
		$scope.populateHeatmap = function (layer) { layer.setData(new google.maps.MVCArray(layer.markers)); };

		$scope.showIntro = true;

		var loadingTimeout = $interval(function() {
			$scope.loadingMessage = loadingMessages.shift();
		}, 850);

		var loader = $interval(function() {
			if ($scope.progress == 100) {
				loader = null;
			}
			$scope.progress += 1;
		}, 200);






		$scope.heat = {};
		$scope.positiveMarkers = [];
		$scope.negativeMarkers = [];
			// {type: 'Cemetery', visible: true, options: {radius: 30, gradient: ['rgba(255,255,255,0)', '#000', '#f00']}},
			// {type: 'Something', visible: true, options: {radius: 15}},

		$scope.saveMe = function(option) {
			angular.forEach(positive, function(set) {
				positivePromises.push($http.get('http://s3-ap-southeast-2.amazonaws.com/govhack-zombies/filtered_' + set + '.json'));
			});

			angular.forEach(negative, function(set) {
				negativePromises.push($http.get('http://s3-ap-southeast-2.amazonaws.com/govhack-zombies/filtered_' + set + '.json'));
			});

			$q.all(negativePromises).then(function(response) {
			 	var data = [], i = 1;
			 	angular.forEach(response, function(res) {
			 		angular.forEach(res.data.items, function(item) {
			 			item.id = i++;
			 			data.push({
			 				location: new google.maps.LatLng(item.latitude, item.longitude),
			 				weight: Math.pow(2, Math.abs(res.data.modifier + 10))
			 			});

			 			$scope.negativeMarkers.push({
			 				id: item.id,
			 				title: item.title,
			 				latitude: item.latitude,
			 				longitude: item.longitude
			 			});
			 		});
			 	});

				$scope.heat['negative'] = {
					visible: true,
					options: { radius: 30, markers: data, gradient: ['rgba(255, 255, 255, 0.1)', "#FF0000", "#DF0000", "#BF0000", "#9F0000", "#7F0000", "#5F0000"]}
				};

				$timeout(function() {
					$scope.$apply();
				});
			});

			$q.all(positivePromises).then(function(response) {
			 	var data = [], i = 1;
			 	angular.forEach(response, function(res) {
			 		angular.forEach(res.data.items, function(item) {
			 			item.id = i++;
			 			data.push({
			 				location: new google.maps.LatLng(item.latitude, item.longitude),
			 				weight: Math.pow(2, Math.abs(res.data.modifier))
			 			});

			 			$scope.positiveMarkers.push({
			 				id: item.id,
			 				title: item.title,
			 				latitude: item.latitude,
			 				longitude: item.longitude
			 			});
			 		});
			 	});

				$scope.heat['positive'] = {
					visible: true,
					options: { radius: 30, markers: data, gradient: ['rgba(255, 255, 255, 0.1)', "#00A000", "#1FAB00", "#3FB700", "#5FC300", "#7FCF00", "#9FDB00", "#BFE700", "#DFF300", "#FFFF00"]}
				};

				$timeout(function() {
					$scope.$apply();
				});
			});
		};

  var onMarkerClicked = function (marker) {
    marker.showWindow = true;
    $scope.$apply();
    window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
  };


  angular.extend($scope, {
    example2: {
      doRebuildAll: false
    },
    clickWindow: function () {
    },
    map: {
      control: {},
      version: "uknown",

      showTraffic: false,
      showWeather: false,
      showHeat: true,
      center: {
        latitude: -37.8165501,
        longitude: 144.96169445
      },
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 20,
        minZoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP,

        styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
              zoomControlOptions: {
      	        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      },
      zoom: 11,
      dragging: false,
      bounds: {},
      markers: [
        {
          id: 1,
          latitude: -37,
          longitude: -145,
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 2,
          latitude: -37,
          longitude: 144,
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          latitude: -37,
          longitude: -144,
          showWindow: false,
          title: 'Plane'
        }
      ],
      markers2: [
        {
          id: 1,
          icon: 'assets/images/blue_marker.png',
          latitude: -38,
          longitude: -144,
          showWindow: false,
          title: '[46,-77]'
        },
        {
          id: 2,
          icon: 'assets/images/blue_marker.png',
          latitude: -38,
          longitude: -145,
          showWindow: false,
          title: '[33,-77]'
        },
        {
          id: 3,
          icon: 'assets/images/blue_marker.png',
          latitude: -37,
          longitude: 145,
          showWindow: false,
          title: '[35,-125]'
        }
      ],
      mexiIdKey: 'mid',
      mexiMarkers: [
        {
          mid: 1,
          latitude: -37,
          longitude: -144
        },
        {
          mid: 2,
          latitude: -37,
          longitude: 144.5
        }
      ],
      clickMarkers: [
        {id: 1, "latitude": 50.948968, "longitude": 6.944781}
        ,
        {id: 2, "latitude": 50.94129, "longitude": 6.95817}
        ,
        {id: 3, "latitude": 50.9175, "longitude": 6.943611}
      ],
      dynamicMarkers: [],


      clusterOptions: {title: 'Hi I am a Cluster!', gridSize: 100, ignoreHidden: true, minimumClusterSize: 2,
        imageExtension: 'png', imageSizes: [72]},
      clickedMarker: {
        title: 'You clicked here',
        latitude: null,
        longitude: null
      },
      events: {
        tilesloaded: function (map, eventName, originalEventArgs) {
        },
        click: function (mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'You clicked here',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          }
          else {
            var marker = {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
            $scope.map.clickedMarker = marker;
          }
          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        },
        dragend: function () {
          self = this;
          $timeout(function () {
//                        modified = _.map($scope.map.mexiMarkers, function (marker) {
//                            return {
//                                latitude: marker.latitude + rndAddToLatLon(),
//                                longitude: marker.longitude + rndAddToLatLon()
//                            }
//                        })
//                        $scope.map.mexiMarkers = modified;
            var markers = [];
            var id = 0;
            if ($scope.map.mexiMarkers !== null && $scope.map.mexiMarkers.length > 0) {
              var maxMarker = _.max($scope.map.mexiMarkers, function (marker) {
                return marker.mid;
              });
              id = maxMarker.mid;
            }

          });
        }
      },
      infoWindow: {
        coords: {
          latitude: 36.270850,
          longitude: -44.296875
        },
        options: {
          disableAutoPan: true
        },
        show: false
      },
      infoWindowWithCustomClass: {
        coords: {
          latitude: 36.270850,
          longitude: -44.296875
        },
        options: {
          boxClass: 'custom-info-window'
        },
        show: true
      },
      templatedInfoWindow: {
        coords: {
          latitude: 48.654686,
          longitude: -75.937500
        },
        options: {
          disableAutoPan: true
        },
        show: true,
        templateUrl: 'assets/templates/info.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
      }


    },
    toggleColor: function (color) {
      return color == 'red' ? '#6060FB' : 'red';
    }

  });

  _.each($scope.map.markers, function (marker) {
    marker.closeClick = function () {
      marker.showWindow = false;
      $scope.$apply();
    };
    marker.onClicked = function () {
      onMarkerClicked(marker);
    };
  });

  _.each($scope.map.markers2, function (marker) {
    marker.closeClick = function () {
      marker.showWindow = false;
      $scope.$apply();
    };
    marker.onClicked = function () {
      onMarkerClicked(marker);
    };
  });

  $scope.removeMarkers = function () {
    $scope.map.markers = [];
    $scope.map.markers2 = [];
    $scope.map.clickedMarker = null;
    $scope.searchLocationMarker = null;
    $scope.map.infoWindow.show = false;
    $scope.map.templatedInfoWindow.show = false;
    // $scope.map.infoWindow.coords = null;
  };
  $scope.refreshMap = function () {
    //optional param if you want to refresh you can pass null undefined or false or empty arg
    $scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});
    $scope.map.control.getGMap().setZoom(11);
    return;
  };
  $scope.getMapInstance = function () {
    alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
    return;
  }
  $scope.map.clusterOptionsText = JSON.stringify($scope.map.clusterOptions);
  $scope.$watch('map.clusterOptionsText', function (newValue, oldValue) {
    if (newValue !== oldValue)
      $scope.map.clusterOptions = angular.fromJson($scope.map.clusterOptionsText);
  });




  $scope.searchLocationMarker = {
    coords: {
      latitude: 40.1451,
      longitude: -99.6680
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {

      }
    }
  }
  $scope.onMarkerClicked = onMarkerClicked;

  $scope.clackMarker = function ($markerModel) {

  };

  $timeout(function () {
    $scope.map.infoWindow.show = true;
    dynamicMarkers = [
      {
        id: 1,
        latitude: 46,
        longitude: -79,
        showWindow: false
      },
      {
        id: 2,
        latitude: 33,
        longitude: -79,
        showWindow: false
      },
      {
        id: 3,
        icon: 'assets/images/plane.png',
        latitude: 35,
        longitude: -127,
        showWindow: false
      }
    ];


    _.each(dynamicMarkers, function (marker) {
      marker.closeClick = function () {
        marker.showWindow = false;
        $scope.$apply();
      };
      marker.onClicked = function () {
        onMarkerClicked(marker);
      };
    });
    $scope.map.dynamicMarkers = dynamicMarkers;
  }, 2000);



  $scope.items = ['item1', 'item2', 'item3'];

  $scope.showOptions = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
},
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


}]);

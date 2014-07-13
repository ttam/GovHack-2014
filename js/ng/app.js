var RATIO = 1.5;
var Cornetto =
	angular.module('GovHack', ['google-maps', 'ui.bootstrap'])

	.controller('InfoController', ['$scope', function($scope) {
		$scope.templateValue = 'hello from the template itself';
		$scope.clickedButtonInWindow = function () {
			var msg = 'clicked a window in the template!';
			alert(msg);
		};
	}])

	.controller('ZombieCtrl', ['$scope', '$timeout', '$interval', '$q', '$http', '$modal', function($scope, $timeout, $interval, $q, $http, $modal) {
		var positive = ['police', 'vic_pubs'],
				positivePromises = [],
				negative = ['cemeteries', 'hospitals'],
				negativePromises = [];

		// Don't know what this does, but i was in the demoI was told to do it.
		// See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
		google.maps.visualRefresh = true;

		// Stuff happens here
		$scope.populateHeatmap = function (layer) {
			if(layer.name == 'positive') {
				$scope.map.positiveControl = layer;
			} else if (layer.name == 'negative') {
				$scope.map.negativeControl = layer;
			}
			layer.setData(new google.maps.MVCArray(layer.markers));
		};

		$scope.showIntro = true;

		$scope.loading = false;
		$scope.progress = 25;


		$scope.heat = {};
		$scope.positiveMarkers = [];
		$scope.negativeMarkers = [];

		$scope.legend = false;
		$scope.toggleLegend = function() {
			$scope.legend = !$scope.legend;
		};

			// {type: 'Cemetery', visible: true, options: {radius: 30, gradient: ['rgba(255,255,255,0)', '#000', '#f00']}},
			// {type: 'Something', visible: true, options: {radius: 15}},

		$scope.showDirections = function() {

			var modal = $modal.open({
				templateUrl: 'directions.html',
				controller: function($scope, $modalInstance) {
					$timeout(function() {
						$('#directions-display').appendTo($('#directions-body'));
					}, 800);
				}
			});
		};

		$scope.saveMe = function(destination) {
			$scope.destinationName = destination;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$scope.map.center = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
					$scope.doSaveMe(destination);
				});
			} else {
				$scope.map.center = {
					latitude: -37.8165501,
					longitude: 144.96169445
				};
				$scope.doSaveMe(destination);
			}


		};

		$scope.doSaveMe = function(destination) {
			_scope = $scope;

			switch(destination) {
				case 'worship':
					$scope.startImg = '/img/cornetto_blue.png';
					$scope.endImg = '/img/destination_prayer.png';
					break;

				case 'drink':
					$scope.startImg = '/img/cornetto_red.png';
					$scope.endImg = '/img/destination_beer.png';
					break;

				case 'sit':
					$scope.startImg = '/img/cornetto_green.png';
					$scope.endImg = '/img/destination_sit.png';
					break;
			}
			var modal = $modal.open({
				templateUrl: 'modal.html',
				controller: function($scope, $modalInstance) {
					$scope.loading = true;
					$scope.progress = 25;
					$scope.loadingMessage = '';
					var loadingMessages = [
						'Assembling Team',
						'Reticulating Splines',
						'Loading threat data',
						'Calculating escape route',
						'Killing Phil',
						'You\'ve got red on you',
						'Cornetto?',
						'Searching...',
						'There\'s one behind you'];
					$scope.message = '';
					$scope.ready = 0;

					var loadingMessage = $interval(function() {
						$scope.loadingMessage = loadingMessages.shift();
					}, 1000);

					var loader = $interval(function() {
						if ($scope.progress >= 100) {
							$scope.progress = 100;
							$interval.cancel(loader);
							$interval.cancel(loadingMessage);
							$timeout(function() {
								$scope.ready++;
							}, 250);
						}

						$scope.progress += 3;
						var barWidth = jQuery("#progBar").find('.progress-bar-danger').css('width');
						jQuery("#loadingimg").css({left: barWidth});
	

					}, 200);

					$scope.$watch('ready', function(newValue) {
						if(newValue == 4) {
							$scope.loading = false;

							switch(_scope.destinationName) {
								case 'worship':
									$scope.message = 'If you want to spend your last precious moments on Earth praying, we have just the place';
									break;

								case 'drink':
									$scope.message = 'It\'s no Winchester, but there\'s a pub just around the corner';
									break;

								case 'sit':
									$scope.message = 'Put your feet up and relax. We\'ve got just the place to sit and watch the action unfold';
									break;

								case 'error':
									$scope.message = 'Looks like there\'s nowhere safe to go. We found a nice comfortable bench for you though';
									break; 
							}
						}
					});

					$scope.closeSplash = function() {
						modal.close();
						$('#splash').hide();
					};

					angular.forEach(positive, function(set) {
						positivePromises.push($http.get('http://s3-ap-southeast-2.amazonaws.com/govhack-zombies/filtered_' + set + '.json'));
					});

					angular.forEach(negative, function(set) {
						negativePromises.push($http.get('http://s3-ap-southeast-2.amazonaws.com/govhack-zombies/filtered_' + set + '.json'));
					});

					$q.all(negativePromises).then(function(response) {
						$scope.ready++;
					 	var data = [], i = 1;
					 	angular.forEach(response, function(res) {
					 		angular.forEach(res.data.items, function(item) {
					 			item.id = i++;
					 			data.push({
					 				location: new google.maps.LatLng(item.latitude, item.longitude),
					 				weight: Math.pow(2, Math.abs(res.data.modifier + 10))
					 			});

					 			// _scope.negativeMarkers.push({
					 			// 	id: item.id,
					 			// 	title: item.title,
					 			// 	latitude: item.latitude,
					 			// 	longitude: item.longitude
					 			// });
					 		});
					 	});

						_scope.heat['negative'] = {
							visible: true,
							options: { name: 'negative', radius: 50 * RATIO, markers: data, gradient: ['rgba(255, 255, 255, 0.1)', "#FF0000", "#DF0000", "#BF0000", "#9F0000", "#7F0000", "#5F0000"]}
						};

						$timeout(function() {
							_scope.$apply();
						});
					});

					$q.all(positivePromises).then(function(response) {
						$scope.ready++;
					 	var data = [], i = 1;
					 	angular.forEach(response, function(res) {
					 		angular.forEach(res.data.items, function(item) {
					 			item.id = i++;
					 			data.push({
					 				location: new google.maps.LatLng(item.latitude, item.longitude),
					 				weight: Math.pow(2, Math.abs(res.data.modifier))
					 			});

					 			// _scope.positiveMarkers.push({
					 			// 	id: item.id,
					 			// 	title: item.title,
					 			// 	latitude: item.latitude,
					 			// 	longitude: item.longitude
					 			// });
					 		});
					 	});

						_scope.heat['positive'] = {
							visible: true,
							options: { name: 'positive', radius: 20 * RATIO, markers: data, gradient: ['rgba(255, 255, 255, 0.1)', "#00A000", "#1FAB00", "#3FB700", "#5FC300", "#7FCF00", "#9FDB00", "#BFE700", "#DFF300", "#FFFF00"]}
						};

						$timeout(function() {
							_scope.$apply();
						});
					});

					var destinationCoords = {},
							waypoints = [];

					switch(destination) {
						case 'worship':

							waypoints.push({
            		location: new google.maps.LatLng(-37.8047715,144.9770817),
            		stopover: true
          		});

							waypoints.push({
            		location: new google.maps.LatLng(-37.8047715,144.9770817),
            		stopover: true
          		});

waypoints.push({
            		location: new google.maps.LatLng(-37.8168077,144.968327),
            		stopover: true
          		});

// waypoints.push({
//             		location: new google.maps.LatLng(-37.8066364,144.9687562),
//             		stopover: true
//           		});

// waypoints.push({
//             		location: new google.maps.LatLng(-37.8008085,144.9702828),
//             		stopover: true
//           		});



// waypoints.push({
//             		location: new google.maps.LatLng(-37.7617303,144.9738202),
//             		stopover: true
//           		});

// waypoints.push({
//             		location: new google.maps.LatLng(-37.7467201,144.9886796),
//             		stopover: true
//           		});

// waypoints.push({
//             		location: new google.maps.LatLng(-37.7431824,144.9893019),
//             		stopover: true
//           		});

waypoints.push({
            		location: new google.maps.LatLng(-37.7407475,144.9896238),
            		stopover: true
          		});













							destinationCoords = new google.maps.LatLng(-37.7390676,144.9898812);
							break;

						case 'drink':
							waypoints.push({
            		location: new google.maps.LatLng(-37.8174153,144.9671391),
            		stopover: true
          		});

							waypoints.push({
            		location: new google.maps.LatLng(-37.8155168,144.9663022),
            		stopover: true
          		});

							waypoints.push({
            		location: new google.maps.LatLng(-37.8146523,144.9690702),
            		stopover: true
          		});

          		waypoints.push({
            		location: new google.maps.LatLng(-37.8090242,144.9663451),
            		stopover: true
          		});

          		waypoints.push({
            		location: new google.maps.LatLng(-37.8069728,144.9658516),
            		stopover: true
          		});

							destinationCoords = new google.maps.LatLng(-37.8073458, 144.968);
							break;

						case 'sit':
							waypoints.push({
            		location: new google.maps.LatLng(-37.8174153,144.9671391),
            		stopover: true
          		});

							waypoints.push({
            		location: new google.maps.LatLng(-37.8155168,144.9663022),
            		stopover: true
          		});

							waypoints.push({
            		location: new google.maps.LatLng(-37.8146523,144.9690702),
            		stopover: true
          		});

          		waypoints.push({
            		location: new google.maps.LatLng(-37.8090242,144.9663451),
            		stopover: true
          		});

          		waypoints.push({
            		location: new google.maps.LatLng(-37.8069728,144.9658516),
            		stopover: true
          		});

							destinationCoords = new google.maps.LatLng(-37.8073458, 144.968);
							break;

						case 'error':
							break;

					}
					getDirections(waypoints, destinationCoords, $scope);





				}
			});


		};




		$scope._saveMe = function(option) {
			$scope.loading = true;



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

		function getDirections(waypoints, destination, _scope) {
			_scope.ready++;
			var directionsService = new google.maps.DirectionsService(),
					directionsDisplay = new google.maps.DirectionsRenderer({
						suppressMarkers: true
					}),
					origin = new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude),
					destination = destination,
					request = {
						origin: origin,
						waypoints: waypoints,
						travelMode: google.maps.TravelMode.WALKING,
						destination: destination
					};


			var _map = $scope.map.control.getGMap();
			directionsDisplay.setMap(_map);
			directionsDisplay.setPanel(document.getElementById('directions-display'));
			directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);

		      var route = response.routes[0];
		      // var summaryPanel = document.getElementById('directions_panel');
		      // var i = 0;
		      // summaryPanel.innerHTML = '';
		      // // For each route, display summary information.

					var startMarker = new google.maps.Marker({
					  position: route.legs[0].start_location,
					  map: _map,
					  icon: new google.maps.MarkerImage(
					   // URL
					   $scope.startImg,
					   // (width,height)
					   new google.maps.Size( 62, 81 ),
					   // The origin point (x,y)
					   new google.maps.Point( 0, 0 ),
					   // The anchor point (x,y)
					   new google.maps.Point( 31, 81 )
					  ),
					  title: 'Current Location'
				 });


					var i = route.legs.length;
		      // alert(i);
		      // for (; i < route.legs.length; i++) {
		      //   var routeSegment = i + 1;
		      //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
		      //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
		      //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
		      //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        //     angular.forEach(route.legs[i].steps, function(step) {
        //     	console.log(step);
	       //      summaryPanel.innerHTML += step.instructions + '<br>';
        //     });
		      // }
		      // alert(i);

					var endMarker = new google.maps.Marker({
					  position: route.legs[i-1].end_location,
					  map: _map,
					  icon: new google.maps.MarkerImage(
					   // URL
					   $scope.endImg,
					   // (width,height)
					   new google.maps.Size( 62, 81 ),
					   // The origin point (x,y)
					   new google.maps.Point( 0, 0 ),
					   // The anchor point (x,y)
					   new google.maps.Point( 31, 81 )
					  ),
					  title: 'Current Location'
				 });



    		}
		  });
		}



  angular.extend($scope, {
    example2: {
      doRebuildAll: false
    },
    clickWindow: function () {
    },
    map: {
      control: {},
      positiveControl: null,
      negativeControl: null,
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
        },
        'zoom_changed': function (mapModel, eventName, originalEventArgs) {
        	// console.group('Zoom Changed');
        	// console.log(mapModel);
        	// console.log(eventName);
        	// console.log(mapModel.getZoom());
        	// console.log($scope.map);
        	// console.groupEnd();
					// $scope.map.positiveControl.setData({radius: Math.floor(Math.random() * 200) + 20 });
					// var z = mapModel.getZoom();
					// $scope.map.positiveControl.setData({radius: 64 });


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
    // $scope.map.control.getGMap().setZoom(11);
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
  








  // getDirections([]);
}]);

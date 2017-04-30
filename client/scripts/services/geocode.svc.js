(function() {

  angular
    .module('myGathering')
    .service('geocode', geocode);

    geocode.$inject = ['$window', '$q', '_', 'Constants'];

    function geocode ($window, $q, _, Constants) {

      // Get locations stored  in local storage to reduce trips to the server
      var locations = $window.localStorage[Constants.LOCATION_ID] ? JSON.parse($window.localStorage[Constants.LOCATION_ID]) : {};

      var default_lat = 43.761539;
      var default_lng = -79.411079;

      var address = {};

      var address = {
          location: {
            "type": "Point",
            "coordinates": []
          },
          country: '',
          country_short: '',
          formatted_address: '',
          locality: '',
          postal_code: '',
          state_prov: '',
          name: ''
      };

      var test_coords = [{
        coords: {
          latitude: 31.503629,
          longitude: 52.523435,
        }
      }, {
        coords: { //Barrie
          latitude: 44.399,
          longitude: -79.727,
        }      
      },
      {
        coords: { // New York
          latitude: 40.712784,
          longitude: -74.005941,
        }      
      },
      {
        coords: { //San Antonia
          latitude: 29.412087,
          longitude: -98.499573,
        }      
      },
      {
        coords: { //London
          latitude: 51.507351,
          longitude: -0.127758,
        }      
      },
      {
        coords: { //Montreal
          latitude: 45.501689,
          longitude: -73.567256,
        }      
      }];

      

      var saveLocations = function (locations) {
        console.log('Save location called:' + JSON.stringify(locations));
        $window.localStorage[Constants.LOCATION_ID] = locations;
      };

      var parseLocation = function (location) {

        //console.log("Data:" + JSON.stringify(location));

        var location_obj = address;

        location_obj.location.coordinates = [location.geometry.location.lng(), location.geometry.location.lat()];
        location_obj.formatted_address = location.formatted_address;

        var components = location.address_components;

        components.forEach(function(types) {

          var component_type = types.types[0];

          switch(component_type) {
            case 'country':
              //console.log('Country:' + types.long_name);
              location_obj.country = types.long_name;
              location_obj.country_short = types.short_name;
              break;
            case 'locality':                
              //console.log('Locality:' + types.long_name);
              location_obj.locality = types.long_name;
              break;
            case 'sublocality_level_1':                
              //console.log('SubLocality:' + types.long_name);
              location_obj.locality = types.long_name;
              break;
            case 'administrative_area_level_1':                
              //console.log('State:' + types.long_name);short
              location_obj.state_prov = types.long_name;
              break;
            case 'postal_code':                
              //console.log('Postal Code:' + types.long_name);
              location_obj.postal_code = types.long_name;
              break;
            default:
                //default code block
          }
        });

        return location_obj;
      };

      var getCoords = function () {

        var latlng;
        var defer = $q.defer();

        if (navigator.geolocation) {
          //console.log('We have a navigator');
          //console.log('Try to use navigator to get GPO coords');

          navigator.geolocation.getCurrentPosition(function(pos){
            latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            //console.log('latlngs:' + latlng);

            if(Constants.ENV === 'true') {
              var temp = test_coords[Math.floor((Math.random() * test_coords.length) + 1) - 1].coords;
              latlng = new google.maps.LatLng(temp.latitude, temp.longitude);
            }
            defer.resolve(latlng);
          }, function(error) {
            console.log('The navigator is turned off, create latlng from default coords');
            latlng = new google.maps.LatLng(default_lat, default_lng);
            defer.resolve(latlng);
          });
          
        } else {
          //console.log('We have NO navigator, use default coords');
          latlng = new google.maps.LatLng(default_lat, default_lng);
          defer.resolve(latlng);
        }

        return defer.promise;
      };

      this.getLocation = function (lat, lng) {

        console.log('GetLocation call in Service');

        var defer = $q.defer();

        coords = new google.maps.LatLng(lat, lng);

        console.log('LatLng:' + coords);

        if (_.has(locations, coords)) {
          console.log('Location found in storage');
          defer.resolve(locations[coords]);
        } else {
          console.log('Location Not found in storage');
          console.log('Get location info from server');

          var geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'latLng': coords }, function (results, status) {

            console.log('Status:' + status);
            console.log('Result in Sevice:' + JSON.stringify(results[1]));

            if (status === google.maps.GeocoderStatus.OK) {

              var parsedAddress = parseLocation(results[1]);         

              //locations[coords] = parsedAddress;

              //saveLocations(JSON.stringify(locations));  

              defer.resolve(parsedAddress);

            } else {

              suc = false;
              defer.reject({
                type: status,
                message: 'Zero results for geocoding your cooords'
              });

            }                 

          }, function(error){
            console.log('Error with geocoder:' + JSON.stringify(error));
              suc = false;
              defer.reject(suc);
          },{
              timeout: 12000
          });
        } //locations = coords

        return defer.promise;


      };

      this.getCurrentLocation = function () {

        var defer = $q.defer();

        getCoords().then(function(coords){

          if(coords){
            //console.log("get Coords result:" + JSON.stringify(coords));

            if (_.has(locations, coords)) {
              //console.log('Location found in storage');
              defer.resolve(locations[coords]);
            } else {
              //console.log('Location Not found in storage');
              //console.log('Get location info from server');

              var geocoder = new google.maps.Geocoder();

              geocoder.geocode({ 'latLng': coords }, function (results, status) {

                //console.log('Status:' + status);
                //console.log('Result:' + JSON.stringify(results[1]));

                if (status === google.maps.GeocoderStatus.OK) {

                  var parsedAddress = parseLocation(results[1]);         

                  //locations[coords] = parsedAddress;

                  //saveLocations(JSON.stringify(locations));  

                  defer.resolve(parsedAddress);

                } else {

                  suc = false;
                  defer.reject({
                    type: status,
                    message: 'Zero results for geocoding your cooords'
                  });

                }                 

              }, function(error){
                console.log('Error with geocoder:' + JSON.stringify(error));
                  suc = false;
                  defer.reject(suc);
              },{
                  timeout: 12000
              });
            } //locations = coords

          }else{
              console.log("error in getCoords");
                defer.reject({
                message: 'Could not get coords'
              });
          } // if result
        }).catch(function(error){
            console.log("get Coords Error:" + JSON.stringify(error));
            defer.reject({
              type: error,
              message: 'Error getting coords'
            });
        });    



        







        return defer.promise;
      };


  }

})();

        // if (_.has(locations, latlng)) {
        //   d.resolve(locations[latlng]);
        // } else {

        //   var geocoder = new google.maps.Geocoder();

        //   geocoder.geocode({ 'latLng': latlng }, function (results, status) {

        //     console.log('Status:' + status);

        //     if (status === google.maps.GeocoderStatus.OK) {

        //       address.location.coordinates = [results[1].geometry.location.lng(), results[1].geometry.location.lat()];
        //       address.formatted_address = results[1].formatted_address;
        //       address_text = results[1].formatted_address;

        //       var components = results[1].address_components;

        //       components.forEach(function(types) {

        //         var component_type = types.types[0];

        //         switch(component_type) {
        //           case 'country':
        //             console.log('Country:' + types.long_name);
        //             address.country = types.long_name;
        //             break;
        //           case 'locality':                
        //             console.log('Locality:' + types.long_name);
        //             address.locality = types.long_name;
        //             break;
        //           case 'sublocality_level_1':                
        //             //console.log('SubLocality:' + types.long_name);
        //             address.locality = types.long_name;
        //             break;
        //           case 'administrative_area_level_1':                
        //             //console.log('State:' + types.long_name);
        //             address.state_prov = types.long_name;
        //             break;
        //           case 'postal_code':                
        //             //console.log('Postal Code:' + types.long_name);
        //             address.postal_code = types.long_name;
        //             break;
        //           default:
        //               //default code block
        //         }
        //       });

        //       locations[latlng] = address;

        //       saveLocations(JSON.stringify(locations));   

        //       d.resolve(address);        

        //     }

        //     return d.promise;
        //   });           
        // }



        







        // var geocoder = new google.maps.Geocoder();
        // var latlng = new google.maps.LatLng(lat, lng);

        // geocoder.geocode({ 'latLng': latlng }, function (results, status) {

        //   if (status === google.maps.GeocoderStatus.OK) {

        //     if (results[1]) {
        //       //console.log('result:' + JSON.stringify(results));

        //       address.location.coordinates = [results[1].geometry.location.lng(), results[1].geometry.location.lat()];
        //       address.formatted_address = results[1].formatted_address;
        //       address_text = results[1].formatted_address;

        //       var components = results[1].address_components;

        //       components.forEach(function(types) {

        //           var component_type = types.types[0];

        //           //console.log("Type:" + component_type);

        //           switch(component_type) {
        //               case 'country':
        //                 console.log('Country:' + types.long_name);
        //                 address.country = types.long_name;
        //                 break;
        //               case 'locality':                
        //                 console.log('Locality:' + types.long_name);
        //                 address.locality = types.long_name;
        //                 break;
        //               case 'sublocality_level_1':                
        //                 //console.log('SubLocality:' + types.long_name);
        //                 address.locality = types.long_name;
        //                 break;
        //               case 'administrative_area_level_1':                
        //                 //console.log('State:' + types.long_name);
        //                 address.state_prov = types.long_name;
        //                 break;
        //               case 'postal_code':                
        //                 //console.log('Postal Code:' + types.long_name);
        //                 address.postal_code = types.long_name;
        //                 break;
        //               default:
        //                   //default code block
        //           }
        //       });

        //       //var maxDistance = vm.distance / 6367.445;

        //       //var query = constructQuery();      

        //       //getGatherings(query);

        //       console.log('address returned in service' + JSON.stringify(address));

        //       return address;

              


        //     } else {
        //         console.log("NO RESULTS FOUND");
        //         return null;
        //     }


        //   } else {
        //     return null;
        //   }



        // });



//       };

//   }

// })();







// angular.module('geocoder', ['ngStorage']).factory('Geocoder', function ($localStorage, $q, $timeout, $rootScope) {
  
//   var locations = $localStorage.locations ? JSON.parse($localStorage.locations) : {};

//   var queue = [];

//   // Amount of time (in milliseconds) to pause between each trip to the
//   // Geocoding API, which places limits on frequency.
//   var QUERY_PAUSE= 250;

//   /**
//    * executeNext() - execute the next function in the queue.
//    *                  If a result is returned, fulfill the promise.
//    *                  If we get an error, reject the promise (with message).
//    *                  If we receive OVER_QUERY_LIMIT, increase interval and try again.
//    */
//   var executeNext = function () {
//     var task = queue[0],
    
//     geocoder = new google.maps.Geocoder();

//     geocoder.geocode({ address : task.address }, function (result, status) {

//       if (status === google.maps.GeocoderStatus.OK) {

//         var parsedResult = {
//           lat: result[0].geometry.location.lat(),
//           lng: result[0].geometry.location.lng(),
//           formattedAddress: result[0].formatted_address
//         };
//         locations[task.address] = parsedResult;

//         $localStorage.locations = JSON.stringify(locations);

//         queue.shift();
//         task.d.resolve(parsedResult);

//       } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
//         queue.shift();
//         task.d.reject({
//           type: 'zero',
//           message: 'Zero results for geocoding address ' + task.address
//         });
//       } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
//         if (task.executedAfterPause) {
//           queue.shift();
//           task.d.reject({
//             type: 'busy',
//             message: 'Geocoding server is busy can not process address ' + task.address
//           });
//         }
//       } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
//         queue.shift();
//         task.d.reject({
//           type: 'denied',
//           message: 'Request denied for geocoding address ' + task.address
//         });
//       } else {
//         queue.shift();
//         task.d.reject({
//           type: 'invalid',
//           message: 'Invalid request for geocoding: status=' + status + ', address=' + task.address
//         });
//       }

//       if (queue.length) {
//         if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
//           var nextTask = queue[0];
//           nextTask.executedAfterPause = true;
//           $timeout(executeNext, QUERY_PAUSE);
//         } else {
//           $timeout(executeNext, 0);
//         }
//       }

//       if (!$rootScope.$$phase) { $rootScope.$apply(); }
//     });
//   };

//   return {
//     geocodeAddress : function (address) {
//       var d = $q.defer();

//       if (_.has(locations, address)) {
//         d.resolve(locations[address]);
//       } else {
//         queue.push({
//           address: address,
//           d: d
//         });

//         if (queue.length === 1) {
//           executeNext();
//         }
//       }

//       return d.promise;
//     }
//   };
// });
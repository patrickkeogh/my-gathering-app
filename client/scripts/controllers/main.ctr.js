(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('MainController', MainController);
        
    MainController.$inject = ['$scope', 'geocode', 'gatheringAPI', 'localData', 'Utils'];
       
    function MainController($scope, geocode, gatheringAPI, localData, Utils) {
      	var vm = this;

      	vm.gatherings = [];

      	vm.carouselChunks = [];
      	vm.showCarousel = false;

      	vm.distance = 10000;
      	vm.itemsPerChunk = 1;

      	vm.selected_address = '';

      	vm.selected = {
      		code: ''
      	};

      	vm.details = '';
      	vm.address_text = '';

      	//vm.countries = localData.getCountries();    	

      	function findWithAttr(array, attr, value) {
		    for(var i = 0; i < array.length; i += 1) {
		        if(array[i][attr] === value) {
		            return i;
		        }
		    }
		    return -1;
		}

      	vm.search_address = Utils.getNewLocationTemplate();

	    vm.distanceOptions = [
	    	{
	    		name: 'Within 1 km of',
	    		value: 1000
	    	},
	    	{
	    		name: 'Within 5 km of',
	    		value: 5000

	    	},
	    	{
	    		name: 'Within 10 km of',
	    		value: 10000
	    	},
	    	{
	    		name: 'Within 25 km of',
	    		value: 25000
	    	},
	    	{
	    		name: 'Within 50 km of',
	    		value: 50000
	    	},
	    	{
	    		name: 'Within 100 km of',
	    		value: 100000
	    	}
	    ];

      	angular.element(document).ready(function() {

        	console.log("init called in Main Controller");

     		geocode.getCurrentLocation().then(function(result){
     			console.log("We have a result:" + JSON.stringify(result));
     			vm.search_address = result;

     			// var id = findWithAttr(vm.countries, 'code', vm.search_address.country_short); // returns 0

		      // 	vm.selected = vm.countries[id];

		      	vm.selectedDistance = vm.distanceOptions[1];

		      	//console.log('Selected:' + JSON.stringify(vm.search_address));


		      	//vm.address_text = vm.search_address.locality + ', ' + vm.search_address.country;

		      	if(vm.search_address.locality !== '') {
		      		vm.address_text += vm.search_address.locality + ', ';
		      	}

		      	if(vm.search_address.state_prov !== '') {
		      		vm.address_text += vm.search_address.state_prov;
		      	}

		      	//console.log('text:' + vm.address_text);

		      	// vm.options = {};

		      	// vm.options.country = vm.selected.code;

     			// use the location data to get gatherings in the area

     			var query = {};

     			//var queryCoords = [vm.search_address.location.coordinates[1], vm.search_address.location.coordinates[0]];

     			//console.log('distance:' + vm.selectedDistance.value);

     			// create a query object
     			query['location.location'] = {
		          	$near: {
		            	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
		            	$minDistance: 0.01,
		            	$maxDistance: vm.selectedDistance.value

		          	}
        		};

         		getGatherings(query);

		    });

		});

		function getNewChunks() {

			var tempArray = [];

			vm.showCarousel = false;
	          
			for (var i = 0, j = vm.gatherings.length; i < j; i += vm.itemsPerChunk) {
		    	tempArray = vm.gatherings.slice(i, i + vm.itemsPerChunk);	

		    	vm.carouselChunks.push(tempArray);
		    	vm.showCarousel = true;
			}

			console.log('Chuinks in Array:' + vm.carouselChunks.length);

		}

		function getGatherings(query) {
			//console.log("Query Used:" + JSON.stringify(query));
	        gatheringAPI.getGatherings(1, 6, query)
	        .then(function(data) {
	          	console.log(data);

	          	vm.gatherings = data.data;

	          	//getNewChunks();
	         	

		    })
	        .catch(function(err) {
	          console.log('failed to get gathering types ' + err);
	        });
	    }

	    vm.clicked = function() {
	    	console.log("clicked called from inside directive");

	    };

	    vm.updateDistance = function () {

	    	console.log('Distance changed');

      		var query = {};

 			console.log('new distance:' + vm.selectedDistance.value);

 			// create a query object
 			query['location.location'] = {
	          	$near: {
	            	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
	            	$minDistance: 0.01,
	            	$maxDistance: vm.selectedDistance.value

	          	}
    		};

    		vm.gatherings = [];
      		vm.carouselChunks = [];

     		getGatherings(query);



	    };

	 //    vm.updateCountry = function() {
	 //    	console.log('Country changed');
		//     //console.log($scope.item.code, $scope.item.name)

		//     vm.options = {};

  //     		vm.options.country = vm.selected.code;

  //     		console.log('Country changed to:' + vm.selected.code);

  //     		vm.address_text = '';

  //     		vm.gatherings = [];
  //     		vm.carouselChunks = [];
  //     		vm.showCarousel = false;
		// };

		$scope.$on('windowResize', function(event, currentBreakpoint, previousBreakpoint) {

         //  	console.log(currentBreakpoint, previousBreakpoint);

         //  	var tmpItemsPerChunk = 1;

         //  	switch(currentBreakpoint) {
         //  		case 'extra small':
         //  			tmpItemsPerChunk = 1;
         //  			break;
         //  		case 'small':
         //  			tmpItemsPerChunk = 2;
         //  			break;
      			// case 'medium':
	      		// 	tmpItemsPerChunk = 3;
	      		// 	break;
      			// case 'large':
	      		// 	tmpItemsPerChunk = 3;
	      		// 	break;
	      		// default:
         //  			tmpItemsPerChunk = 3;
         //  			break;

         //  	}

         //  	if(tmpItemsPerChunk !== vm.itemsPerChunk) {

         //  		console.log('change items per chunk too:' + tmpItemsPerChunk);
         //  		vm.itemsPerChunk = tmpItemsPerChunk;
         //  		vm.carouselChunks = [];

         //  		getNewChunks();
         //  		$scope.$apply();
         //  	}



      	});




		$scope.$watch('vm.address_details', function(newValue, oldValue) {

	      	if (newValue !== oldValue) {

	        	console.log("Address Changed:" + JSON.stringify(vm.address_details.geometry.location));

	        	geocode.getLocation(vm.address_details.geometry.location.lat(), vm.address_details.geometry.location.lng())
	        	.then(function(result) {

					console.log("We have a result:");
					vm.search_address = result;


					console.log('Result:' + JSON.stringify(result));

					var query = {};

					

					// create a query object
					query['location.location'] = {
			      	$near: {
			        	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
			        	$minDistance: 0.01,
			        	$maxDistance: vm.distance

			      	}
				};

					vm.gatherings = [];
	      			vm.carouselChunks = [];

					getGatherings(query);

			    });


	      }
	    }, true);

		// $scope.$watch('vm.selected_address', function(newValue, oldValue) {
		//   if (newValue !== oldValue) {
		//     vm.options = {};

  //     		vm.options.country = vm.selected.code;
		//   }
		// }. true);

	

	

  
      	
      
    }
}());
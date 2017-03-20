(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('MainController', MainController);
        
    MainController.$inject = ['$scope', 'geocode', 'gatheringAPI', 'localData'];
       
    function MainController($scope, geocode, gatheringAPI, localData) {
      	var vm = this;

      	vm.gatherings = [];

      	vm.distance = 10000;

      	vm.selected_address = '';

      	

      	vm.selected = {
      		code: ''
      	};

      	vm.details = '';
      	vm.address_text = '';

      	vm.countries = localData.getCountries();    	

      	function findWithAttr(array, attr, value) {
		    for(var i = 0; i < array.length; i += 1) {
		        if(array[i][attr] === value) {
		            return i;
		        }
		    }
		    return -1;
		}

      	vm.search_address = {
	      	location: {
	        	"type": "Point",
	        	"coordinates": [-79.3790818,43.64352050000001]
	      	},
	      	country: '',
	      	formatted_address: '',
	      	locality: '',
	      	postal_code: '',
	      	state_prov: '',
	      	name: '',
	      	notes: ''
	    };

	    vm.distanceOptions = [
	    	{
	    		name: 'Within 1 km',
	    		value: 1000
	    	},
	    	{
	    		name: 'Within 5 km',
	    		value: 5000

	    	},
	    	{
	    		name: 'Within 10 km',
	    		value: 1000
	    	},
	    	{
	    		name: 'Within 25 km',
	    		value: 25000
	    	},
	    	{
	    		name: 'Within 50 km',
	    		value: 50000
	    	},
	    	{
	    		name: 'Within 100 km',
	    		value: 100000
	    	}
	    ];

      	angular.element(document).ready(function() {

        	console.log("init called in Main Controller");

     		geocode.getLocation().then(function(result){
     			console.log("We have a result:");
     			vm.search_address = result;

     			var id = findWithAttr(vm.countries, 'code', vm.search_address.country_short); // returns 0

		      	console.log("id=" + id);

		      	vm.selected = vm.countries[id];

		      	vm.selectedDistance = vm.distanceOptions[1];

		      	console.log('Selected:' + JSON.stringify(vm.search_address));


		      	//vm.address_text = vm.search_address.locality + ', ' + vm.search_address.country;

		      	if(vm.search_address.locality !== '') {
		      		vm.address_text += vm.search_address.locality + ', ';
		      	}

		      	if(vm.search_address.state_prov !== '') {
		      		vm.address_text += vm.search_address.state_prov;
		      	}

		      	console.log('text:' + vm.address_text);

		      	vm.options = {};

		      	vm.options.country = vm.selected.code;

     			// use the location data to get gatherings in the area

     			var query = {};

     			console.log('distance:' + vm.selectedDistance.value);

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

		function getGatherings(query) {
	        gatheringAPI.getGatherings(1, 10, query)
	        .then(function(data) {
	          console.log(data);

	          vm.gatherings = data.data;
	        })
	        .catch(function(err) {
	          console.log('failed to get gathering types ' + err);
	        });
	    }


	    $scope.$watch('vm.selected', function(newValue, oldValue) {
		  if (newValue !== oldValue) {
		    vm.options = {};

      		vm.options.country = vm.selected.code;

      		console.log('Country changed');
		  }
		}. true);

		$scope.$watch('vm.address_text', function(newValue, oldValue) {
		  if (newValue !== oldValue) {

		  }
		}. true);

		// $scope.$watch('vm.selected_address', function(newValue, oldValue) {
		//   if (newValue !== oldValue) {
		//     vm.options = {};

  //     		vm.options.country = vm.selected.code;
		//   }
		// }. true);




  
      	
      
    }
}());
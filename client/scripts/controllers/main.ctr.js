(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('MainController', MainController);
        
    MainController.$inject = ['$scope', 'geocode', 'gatheringAPI', 'localData'];
       
    function MainController($scope, geocode, gatheringAPI, localData) {
      	var vm = this;

      	vm.distance = 10000;

      	vm.gatherings = [];

      	vm.selected_address = '';
      	vm.details = '';

      	vm.countries = localData.getCountries();    	

      	function findWithAttr(array, attr, value) {
		    for(var i = 0; i < array.length; i += 1) {
		        if(array[i][attr] === value) {
		            return i;
		        }
		    }
		    return -1;
		}

		var id = findWithAttr(vm.countries, 'code', 'VI'); // returns 0

      	console.log("id=" + id);

      	vm.selected = vm.countries[id];

      	vm.options = {};

      	vm.options.country = vm.selected.code;

	// 	vm.optionns = { 
 //      		type: '(cities)',
 //      		county: 'ca'
 //      	};

 //      	vm.options = {
 //  type: ['(cities)'],
 //  componentRestrictions: {country: "us"}
 // };



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

      	angular.element(document).ready(function() {

        	console.log("init called in Main Controller");

     		geocode.getLocation().then(function(result){
     			console.log("We have a result:");
     			vm.selected_address = result;

     			// use the location data to get gatherings in the area

     			var query = {};

     			// create a query object
     			query['location.location'] = {
		          	$near: {
		            	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
		            	$minDistance: 0.01,
		            	$maxDistance: vm.distance

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

	    $scope.$watch("vm.selected", function(data) {
      
	      	console.log("Address Changed");

	      	vm.options = {};

      		vm.options.country = vm.selected.code;


	    }, true);




  
      	
      
    }
}());
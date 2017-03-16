(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('MainController', MainController);
        
    MainController.$inject = ['$scope', 'geocode', 'gatheringAPI'];
       
    function MainController($scope, geocode, gatheringAPI) {
      	var vm = this;

      	vm.distance = 10000;

      	vm.gatherings = [];

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
     			vm.search_address = result;

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


      	
      
    }
}());
(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('SearchController', SearchController);
        
    SearchController.$inject = ['$scope', 'geocode', 'gatheringAPI'];
       
    function SearchController($scope, geocode, gatheringAPI) {
      	var vm = this;

      	vm.gatherings = [];
      	vm.distance = 10000;

      	vm.details = '';
      	vm.address_text = '';
      	vm.selected_address = '';

      	vm.numToShow = 6;
    	vm.numShowing = 0;
    	vm.showMoreButton = false;

    	vm.search_message = "New Gatherings";


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
        	console.log("init called in Search Controller");

        	vm.selectedDistance = vm.distanceOptions[1];


        	geocode.getCurrentLocation().then(function(result){

     			console.log("We have a result:" + JSON.stringify(result));
     			vm.search_address = result;

		      	vm.selectedDistance = vm.distanceOptions[1];

		      	//console.log('Selected:' + JSON.stringify(vm.search_address));


		      	//vm.address_text = vm.search_address.locality + ', ' + vm.search_address.country;

		      	if(vm.search_address.locality !== '') {
		      		vm.address_text += vm.search_address.locality + ', ';
		      	}

		      	if(vm.search_address.state_prov !== '') {
		      		vm.address_text += vm.search_address.state_prov;
		      	}

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
			//console.log("Query Used:" + JSON.stringify(query));
	        gatheringAPI.getGatherings(1, 6, query)
	        .then(function(data) {
	          	console.log(data);

	          	vm.gatherings = data.data;

	          	constructFooterTag();

	          	//getNewChunks();
	         	

		    })
	        .catch(function(err) {
	          console.log('failed to get gathering types ' + err);
	        });
	    }

	    function constructFooterTag() {
      
	      	var ttlGatherings = 0;
	      	var myGatherings = vm.gatherings;

	      	if(myGatherings === undefined) {        
	      	} else {
	        	ttlGatherings = myGatherings.length;
	      	}

	      	if(vm.numToShow >= ttlGatherings){
	        	vm.numShowing = ttlGatherings;
	        	vm.showMoreButton = false;
	      	} else {
	        	vm.numShowing = vm.numToShow;
	        	vm.showMoreButton = true;
	     	}
	     	console.log('numShowing:' + vm.numShowing);

	      	vm.showing_msg = "Showing " + vm.numShowing + " of " + ttlGatherings;
	      	

	    }

		vm.updateDistance = function () {

	    	console.log('Distance changed');

      		var query = {};

 			console.log('new distance:' + vm.selectedDistance.value);

 			// create a query object
 			query['location.location'] = {
	          	$near: {
	            	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
	            	$minDistance: 0.01,
	            	$maxDistance: vm.distance

	          	}
    		};

    		vm.gatherings = [];
      		//vm.carouselChunks = [];

     		getGatherings(query);

	    };


	    // ===============================================================================================

	  // Date related functions
    // ======================================================================================================
    function getDayClass(data) {
        var date = data.date,
        mode = data.mode;

        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i = 0; i < vm.events.length; i++) {
              var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

              if (dayToCheck === currentDay) {
                return vm.events[i].status;
              }
          }
        }

        return '';
    }

    vm.today = function() {
      vm.start_date = new Date();
      vm.end_date = new Date();
    };
        
    vm.today();

    vm.clearDate = function() {
      vm.start_date = null;
      vm.end_date = null;
    };

    vm.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    vm.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
        mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    vm.toggleMin = function() {
        vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
        vm.dateOptions.minDate = vm.inlineOptions.minDate;
    };

    vm.toggleMin();

    vm.open1 = function() {
        console.log('Open 1 calledss');
        vm.popup1.opened = true;
    };

    vm.open2 = function() {
        console.log('Open 1 calledss');
        vm.popup2.opened = true;
    };

    vm.setDate = function(year, month, day) {
        vm.dt = new Date(year, month, day);
    };

    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup1 = {
        opened: false,
        maxDate: new Date('10/04/2016')
    };

    vm.popup2 = {
        opened: false,
        maxDate: new Date('10/04/2016')
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
      
    vm.events = [
      {
          date: tomorrow,
          status: 'full'
      },
    {
          date: afterTomorrow,
          status: 'partially'
      }
    ];




	

	

  
      	
      
    }
}());
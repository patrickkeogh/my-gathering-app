(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('SearchController', SearchController);
        
    SearchController.$inject = ['$scope', 'geocode', 'gatheringAPI', 'Utils'];
       
    function SearchController($scope, geocode, gatheringAPI, Utils) {
      	var vm = this;

      	vm.gatherings = [];

      	vm.details = '';
      	vm.address_text = '';
      	vm.selected_address = '';

      	vm.numToShow = 6;
    	vm.numShowing = 0;
    	vm.showMoreButton = false;

    	vm.search_message = "New Gatherings";

      	vm.distanceOptions = Utils.getDistanceSearchOptions();

      	gatheringAPI.getTypes()
		    .then(function(data) {
        	console.log(data);
        	vm.types = data.data;
      	})
      	.catch(function(err) {
        	console.log('failed to get gathering types ' + err);
      	});

	      gatheringAPI.getTopics()
		    .then(function(data) {
        	console.log(data);
        	vm.topics = data.data;
      	})
      	.catch(function(err) {
        	console.log('failed to get gathering topics ' + err);
      	});


	    angular.element(document).ready(function() {
        	console.log("init called in Search Controller");

        	vm.selectedDistance = vm.distanceOptions[2];

        	geocode.getCurrentLocation().then(function(result){

     			//console.log("We have a result:" + JSON.stringify(result));
     			vm.search_address = result;

     			// Set the default value for the distance select box
		      	//vm.selectedDistance = vm.distanceOptions[3];

		      	//console.log('Selected:' + JSON.stringify(vm.search_address));


		      	//vm.address_text = vm.search_address.locality + ', ' + vm.search_address.country;

		      	if(vm.search_address.locality !== '') {
		      		vm.address_text += vm.search_address.locality + ', ';
		      	}

		      	if(vm.search_address.state_prov !== '') {
		      		vm.address_text += vm.search_address.state_prov;
		      	}

     			var query = constructQuery();



    			// create a query object
     			// query['location.location'] = {
		      //     	$near: {
		      //       	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
		      //       	$minDistance: 0.01,
		      //       	$maxDistance: vm.selectedDistance.value

		      //     	}
        // 		};

         		getGatherings(query);

		    });
		});

		function getGatherings(query) {
			console.log("Query Used:" + JSON.stringify(query));
	        gatheringAPI.getGatherings(1, 6, query)
	        .then(function(data) {
	          	console.log(data);

	          	vm.gatherings = data.data;

	          	constructFooterTag();

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

	    function constructQuery() {

      		var query = {};
      		var startDate, endDate;

      		//startDate = $moment(vm.search_date_start).toDate();

      		//startDate = new Date(vm.search_date_start); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")

	      // startDate.setSeconds(0);
	      // startDate.setHours(0);
	      // startDate.setMinutes(0);

	      // console.log("Date Filter:" + vm.date_filter);

	      // // create date query
	      // switch(vm.date_filter) {
	      //   case 1:     

	      //     endDate = $moment(vm.search_date_start).toDate();
	      //     endDate.setHours(23);
	      //     endDate.setMinutes(59);
	      //     endDate.setSeconds(59);
	          
	      //     console.log("End DATE:" + endDate);

	      //     query = {
	      //       gathering_start_date_time: {
	      //         $gt:startDate,
	      //         $lt:endDate
	      //       }
	      //     };
	      //     break;

	      //   case 2:
	      //   case 3:
	      //   case 4:
	      //     console.log("Case 2 and 3:" + vm.date_filter);

	      //     endDate = $moment(vm.search_date_end).toDate();
	      //     endDate.setHours(23);
	      //     endDate.setMinutes(59);
	      //     endDate.setSeconds(59);

	      //     console.log("Start DATE:" + startDate);
	      //     console.log("End DATE:" + endDate);


	      //     break;
	      // }

      // query["$or"]=[];
      // query["$or"].push({"field":"value1"});
      // query["$or"].push({"field":"value2"});
      // query["date_created"]="whatever";

      //db.products.find({"imgs.0": "http://foo.jpg"})

      console.log("TYPE:" + vm.search_type );


      	if (typeof vm.search_type === 'undefined') {
        	console.log("Search TYPE is BADDDDDDDDDDDDDDDDDDD:" + vm.search_type );
      	}else{
      		console.log("Use the Type");
      		query['type.0._id'] = vm.search_type._id;       
      	}

      	if (typeof vm.search_topic === 'undefined') {
        	console.log("Search TOPIC is BADDDDDDDDDDDDDDDDDDD");
      	} else {
        	query['topic.0._id'] = vm.search_topic._id;
      	}

      // if(vm.date_filter === 4) {
      //   console.log("Only use a start Date");

      //   query.gathering_start_date_time = {
      //     $gt: startDate
      //   };

      // } else {
      //   query.gathering_start_date_time = {
      //     $gt: startDate,
      //     $lt: endDate
      //   };
      // }


      // query.gathering_start_date_time = {
      //   $gt: startDate,
      //   $lt: endDate
      // };


query['location.location'] = {
	          $near: {
	            $geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
	            $minDistance: 0.01,
	            $maxDistance: vm.selectedDistance.value

	          }
	        };
      	

      





	      
	      //query.push({gathering_start_date_time: {$gt:startDate, $lt:endDate } });
	      // query["$and"].push({'location.location': {$near : {
	      //            $geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
	      //            $minDistance: 1,
	      //            $maxDistance: vm.distance }}});


	      return query;



	    }

	    vm.resetType = function() { 

	    	vm.search_type = 'undefined';

	    	var query = constructQuery(); 
        	getGatherings(query); 

	    };

	    vm.resetTopic = function() { 

	    	vm.search_topic = 'undefined';

	    	var query = constructQuery(); 
        	getGatherings(query); 

	    };

	    vm.updateQuery = function() {
	    	console.log('updateQuery called:');

	    	var query = constructQuery(); 
        	getGatherings(query); 

	    };

	    // ng-click event to show more records
	    vm.showMoreRecs = function() {
			console.log('Show More Recs Called');

			if (vm.gatherings.length > vm.numToShow) {

				vm.numToShow += 6; // load 6 more 
				console.log('Show 6 More Recs');
			}
			constructFooterTag();
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
     		getGatherings(query);

	    };


	    $scope.$watch('vm.search_type', function(newValue, oldValue) {
	      	if (newValue !== oldValue) {
	      		console.log("Type has changed");
	        	// do whatever you were going to do
	        	//var query = constructQuery(); 

	        	//getGatherings(query); 
	      	}
	    }, true);

	    $scope.$watch('vm.search_topic', function(newValue, oldValue) {
	      	if (newValue !== oldValue) {
	        	// do whatever you were going to do
	        	//var query = constructQuery(); 

	        	//getGatherings(query); 
	      	}
	    }, true);

	    $scope.$watch('vm.address_details', function(newValue, oldValue) {

	      	if (newValue !== oldValue) {

	        	console.log("Address Changed:" + JSON.stringify(vm.address_details.geometry.location));

	        	geocode.getLocation(vm.address_details.geometry.location.lat(), vm.address_details.geometry.location.lng())
	        	.then(function(result) {

					console.log("We have a result:");
					vm.search_address = result;

					//console.log('Result:' + JSON.stringify(result));

					var query = {};					

					// create a query object
					query['location.location'] = {
				      	$near: {
				        	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
				        	$minDistance: 0.01,
				        	$maxDistance: vm.selectedDistance.value
				      	}
					};

					vm.gatherings = [];

					getGatherings(query);

			    });

	      	}

	    }, true);




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
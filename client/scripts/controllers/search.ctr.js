(function(){
  	'use strict';
  	angular
    .module('myGathering')
    .controller('SearchController', SearchController);
        
    SearchController.$inject = ['$scope', '$state', '$document', '$uibModal', '$moment', 'geocode', 'gatheringAPI', 'Utils'];

    angular
    .module('myGathering')
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$scope', '$moment', 'geocode', 'gatheringAPI', 'Utils', '$uibModalInstance'];

    function ModalInstanceCtrl($scope, $moment, geocode, gatheringAPI, Utils, $uibModalInstance) {

    	var vm = this;

    	vm.gatherings = [];

    	vm.details = '';
      	vm.address_text = '';
      	vm.selected_address = '';
      	vm.options = null;
      	vm.address_details = null;
      	vm.start_date = new Date();
      	vm.isDateDisabled = true;

    	vm.distanceOptions = Utils.getDistanceSearchOptions();
      	vm.dateSearchOptions = Utils.getDateSearchOptions();

    	vm.message = 'Back from the Modal Instance';

    	gatheringAPI.getTypes()
		    .then(function(data) {
        	//console.log(data);
        	vm.types = data.data;
      	})
      	.catch(function(err) {
        	console.log('failed to get gathering types ' + err);
      	});

	      gatheringAPI.getTopics()
		    .then(function(data) {
        	//console.log(data);
        	vm.topics = data.data;
      	})
      	.catch(function(err) {
        	console.log('failed to get gathering topics ' + err);
      	});

      	angular.element(document).ready(function() {
        	console.log("init called in Search Controller");

        	vm.selectedDistance = vm.distanceOptions[2];
        	vm.selectedDate = vm.dateSearchOptions[3];

        	geocode.getCurrentLocation().then(function(result){

     			console.log("We have a result:" + JSON.stringify(result));
     			vm.search_address = result;

		      	if(vm.search_address.locality !== '') {
		      		vm.address_text += vm.search_address.locality + ', ';
		      	}

		      	if(vm.search_address.state_prov !== '') {
		      		vm.address_text += vm.search_address.state_prov;
		      	}

		      	if(vm.search_address.country_short !== '') {
		      		vm.address_text += ", " + vm.search_address.country_short;
		      	}

     			var query = constructQuery();

        		getGatherings(query);

		    });
		});


		vm.ok = function () {
		    $uibModalInstance.close(vm.gatherings);
		};

		vm.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		};

		vm.updateQuery = function() {
	    	console.log('updateQuery called:');

	    	var query = constructQuery(); 
        	getGatherings(query); 

	    };

	    vm.resetForm = function() { 

	    	vm.search_type = 'undefined';
	    	vm.search_topic = 'undefined';
	    	vm.selectedDistance = vm.distanceOptions[2];
        	vm.selectedDate = vm.dateSearchOptions[3];

	    	var query = constructQuery(); 
        	getGatherings(query); 

	    };

	    $scope.$watch('vm.address_details', function(newValue, oldValue) {

	      	if (newValue !== oldValue) {

	        	console.log("Address Changed:" + JSON.stringify(vm.address_details.geometry.location));

	        	geocode.getLocation(vm.address_details.geometry.location.lat(), vm.address_details.geometry.location.lng())
	        	.then(function(result) {

					console.log("We have a result:");
					vm.search_address = result;

					vm.gatherings = [];
					var query = constructQuery();					
					getGatherings(query);

			    });

	      	}

	    }, true);

	    $scope.$watch("vm.start_date", function(date) {
	    	vm.gatherings = [];
					var query = constructQuery();					
					getGatherings(query);
        
	      	

	    }, true);

		function getGatherings(query) {
			console.log("Query Used:" + JSON.stringify(query));
	        gatheringAPI.getGatherings(1, 6, query)
	        .then(function(data) {
	          	console.log(data);

	          	vm.gatherings = data.data;	          	

		    })
	        .catch(function(err) {
	          console.log('failed to get gathering types ' + err);
	        });
	    }

		function constructQuery() {

			console.log('Construct Query has been enetered');

      		var query = {};
      		var startDate;
      		var endDate;
      		var futureDate;

      		//startDate.setSeconds(0);
	      	//startDate.setHours(0);
	      	//startDate.setMinutes(0);

	      	console.log("Date Filter Used:" + vm.selectedDate.value);

	      	if(vm.selectedDate.value !== 0 ) {


	      		switch(vm.selectedDate.value) {
		      		case 1: // Today
		      			
		      			startDate = new Date($moment().hour(0).minute(0).second(0));
		      			endDate = new Date($moment().hour(23).minute(59).second(59));
		      			vm.start_date = new Date(startDate);

		      			vm.isDateDisabled = true;

		      			
		      			//console.log('Today Start:' + startDate);
		      			//console.log('Today End:' + endDate);
		      			break;
		      		case 2: // Tomorrow	      			

		      			futureDate = $moment().add(1, 'd');
		      			startDate = new Date($moment(futureDate).hour(0).minute(0).second(0));
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));
		      			vm.start_date = new Date(startDate);

		      			vm.isDateDisabled = true;

		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);

		      			break;
		      		case 3: // Next Week
		      			startDate = new Date($moment(vm.start_date).hour(0).minute(0).second(0));
		      			futureDate = $moment(vm.start_date).add(1, 'w');
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

		      			vm.isDateDisabled = false;

		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);
		      			break;
		      		case 4: // Next Month
		      			startDate = new Date($moment(vm.start_date).hour(0).minute(0).second(0));
		      			futureDate = $moment(vm.start_date).add(1, 'M');
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

		      			vm.isDateDisabled = false;

		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);
		      			break;
		      		case 5: // Next Year
		      			startDate = new Date($moment(vm.start_date).hour(0).minute(0).second(0));
		      			futureDate = $moment(vm.start_date).add(1, 'y');
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

		      			vm.isDateDisabled = false;
		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);
		      			break;
		      	}		      	

		      	query.gathering_start_date_time = {
		          	$gt:startDate,
		            $lt:endDate
		        };
	      	}

	      	console.log("TYPE:" + vm.search_type );


	      	if (typeof vm.search_type === 'undefined') {
	        	//console.log("Search TYPE is BADDDDDDDDDDDDDDDDDDD:" + vm.search_type );
	      	}else{
	      		query['type.0._id'] = vm.search_type._id;       
	      	}

	      	if (typeof vm.search_topic === 'undefined') {
	        	//console.log("Search TOPIC is BADDDDDDDDDDDDDDDDDDD");
	      	} else {
	        	query['topic.0._id'] = vm.search_topic._id;
	      	}

	      	console.log('address:' + vm.search_address);

	      	
			if(typeof vm.search_address === 'undefined') {
	      		// Dont include address in the search
	      	} else {

				query['location.location'] = {
		          	$near: {
		            	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
		            	$minDistance: 0.01,
		            	$maxDistance: vm.selectedDistance.value

		          	}
		        };
	      	}	
	  			

		    return query;

	    }

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
    };
        
    vm.today();

    vm.clearDate = function() {
      vm.start_date = null;
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
       
    function SearchController($scope, $state, $document, $uibModal, $moment, geocode, gatheringAPI, Utils) {
      	var vm = this;

      	vm.gatherings = [];      	

      	vm.numToShow = 0;
    	vm.numShowing = 0;
    	vm.showMoreButton = false;

    	vm.search_message = "New Gatherings";      	

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

	    

	    vm.openSearchModal = function(size, parentSelector) {

	    	var parentElem = parentSelector ? 
      		angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

      		var modalInstance = $uibModal.open({
      			animation: true,
      			ariaLabelledBy: 'modal-title',
      			ariaDescribedBy: 'modal-body',
      			backdrop: 'static',
      			templateUrl: '../views/modals/search.modal.html',
      			controller: 'ModalInstanceCtrl',
      			controllerAs: 'vm'
      		});

      		modalInstance.result.then(function (gatherings_in) {
      			vm.gatherings = gatherings_in;

      			console.log("Modal gatherings returned");
      			console.log(vm.gatherings);
      			vm.showMoreRecs();
      		}, function() {
      			console.log('Modal dismissed at: ' + new Date());
      		});


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

		vm.goToDetails = function(gathering) {
	    	$state.go('gathering-dashboard', {id: gathering._id});
	    };

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
      
    }
}());



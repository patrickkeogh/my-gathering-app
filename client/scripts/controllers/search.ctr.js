(function(){
  	'use strict';
  	angular
    .module('myGathering')
    .controller('SearchController', SearchController);
        
    SearchController.$inject = ['$scope', '$document', '$uibModal', '$moment', 'geocode', 'gatheringAPI', 'Utils'];

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

     			//console.log("We have a result:" + JSON.stringify(result));
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
		      			//console.log('Today Start:' + startDate);
		      			//console.log('Today End:' + endDate);
		      			break;
		      		case 2: // Tomorrow	      			

		      			futureDate = $moment().add(1, 'd');
		      			startDate = new Date($moment(futureDate).hour(0).minute(0).second(0));
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);

		      			break;
		      		case 3: // Next Week
		      			startDate = new Date($moment().hour(0).minute(0).second(0));
		      			futureDate = $moment().add(1, 'w');
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);
		      			break;
		      		case 4: // Next Month
		      			startDate = new Date($moment().hour(0).minute(0).second(0));
		      			futureDate = $moment().add(1, 'M');
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

		      			//console.log('Tomorrow Start:' + startDate);
		      			//console.log('Tomorrow End:' + endDate);
		      			break;
		      		case 5: // Next Year
		      			startDate = new Date($moment().hour(0).minute(0).second(0));
		      			futureDate = $moment().add(1, 'y');
		      			endDate = new Date($moment(futureDate).hour(23).minute(59).second(59));

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


			query['location.location'] = {
	          	$near: {
	            	$geometry: { type: "Point",  coordinates: vm.search_address.location.coordinates },
	            	$minDistance: 0.01,
	            	$maxDistance: vm.selectedDistance.value

	          	}
	        };	

		    return query;

	    }




    }
       
    function SearchController($scope, $document, $uibModal, $moment, geocode, gatheringAPI, Utils) {
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



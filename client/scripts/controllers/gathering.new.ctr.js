(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('NewGatheringController', CreateGatheringController);
        
    CreateGatheringController.$inject = ['$state','$scope', '$moment', 'Authentication', 'gatheringAPI'];
       
    function CreateGatheringController($state, $scope, $moment, Authentication, gatheringAPI) {

      var vm = this;

      var width, height;
      
      vm.options1 = null;
    	vm.address_details = '';

    	vm.isFormValid = true;

    	vm.invalid_start_date = false;
    	vm.invalid_end_date = false;

      	vm.formErrors = {
      		invalidDate: "The End Date cannot be before the Start Date"
    	};

      vm.newGathering = {
    		//id: 1,
	    	name:"", 
	    	description: "",
	    	location: {}, 
	      type: "",    
	      topic: "", 
	    	gathering_start_date_time: "",
	      gathering_end_date_time: "",
	    	directions: "",
	    	access: "Public",
	    	notes: "",
	    	status: "Not Published",
        owner: {}
	   	};

      	angular.element(document).ready(function() {

    		console.log("init called in Gathering");

    		vm.gatheringAddress = {
		      	location: {
		        	"type": "Point",
		        	"coordinates": [-79.3790818, 43.64352050000001] //long, lat for mongo
		      	},
		      	country: '',
            country_short: '',
		      	formatted_address: '',
		      	locality: '',
		      	postal_code: '',
		      	state_prov: '',
		      	name: '',
		      	notes: ''
		    };

		    width = angular.element(document.getElementById('map-container-width')).prop('offsetWidth');
		    height = angular.element(document.getElementById('map-container-height')).prop('offsetHeight') - 120;
		    //var height = 200;

		    console.log('Width:' + width);
		    console.log('height:' + height);

    		constructImageUrl(width, height);

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

	      vm.currentUser = Authentication.getCurrentUser();

	      vm.newGathering.owner = {
				  ownerId: vm.currentUser._id,
				  username: vm.currentUser.username,
				  name: vm.currentUser.name
    		};
        
  		});

  		function constructImageUrl(width, height){
      		var urlbase = "https://maps.googleapis.com/maps/api/staticmap?size=" + width + "x" + height + "&sensor=false&maptype=roadmap";

      		vm.imgurl = urlbase;

			vm.imgurl += "&markers=color:red|" +  vm.gatheringAddress.location.coordinates[1] + "," + vm.gatheringAddress.location.coordinates[0];
      		
      		vm.imgurl += "&key=AIzaSyAf7uV3v7upRbATDfluOmSaoHMgsgXRkDM";

      		//console.log("IMG URL:" + vm.imgurl);
        }

        vm.createGathering = function() {
			console.log("createGathering called");

	     	vm.newGathering.gathering_start_date_time = vm.start_date;
	       	vm.newGathering.gathering_end_date_time = vm.end_date;

	      	if(!$scope.createGatheringForm.name.$valid) {
	        	console.log("FORM IS INVALID+++++++++++++++++++++++++++++++++++++");
	        	//vm.showSimpleToast("Message");

	        	$('#name').focus();

	        	vm.isFormValid = false;
	      	}

      		if(!$scope.createGatheringForm.description.$valid) {
        		console.log("FORM IS INVALID+++++++++++++++++++++++++++++++++++++");
        		//vm.showSimpleToast("Message");

        		$('#description').focus();

        		vm.isFormValid = false;
      		}

      		if(vm.invalid_start_date) {
        		console.log("FORM IS INVALID+++++++++++++++++++++++++++++++++++++");
        		//vm.showSimpleToast("Message");

        		$('#startDate').focus();

        		vm.isFormValid = false;

      		}

      		if(vm.invalid_end_date) {
        		console.log("FORM IS INVALID+++++++++++++++++++++++++++++++++++++");
        		//vm.showSimpleToast("Message");

        		$('#endDate').focus();

        		vm.isFormValid = false;

      		}

      		if(!$scope.createGatheringForm.location.$valid) {
        		console.log("FORM IS INVALID+++++++++++++++++++++++++++++++++++++");
        		//vm.showSimpleToast("Message");

        		$('#city').focus();

        		vm.isFormValid = false;
      		}


      		vm.newGathering.location = vm.gatheringAddress;

	      	if(vm.isFormValid) {

	        	console.log("Post the form to the server");

	        	gatheringAPI.createGathering(vm.newGathering)
			    .then(function(data) {
			    	console.log("Gathering Added");
			    	//console.log("data=" + JSON.stringify(data));
			    	$state.go('gathering-dashboard', {id: data.data.id});		        	
		      	})
		      	.catch(function(err) {
		        	console.log('failed to create gathering ' + err);
		      	});
	      	}
  		};

  		$scope.$watch("vm.address_details", function(data) {
      
	      	console.log("Address Changed");

	      	var str = JSON.stringify(vm.address_details);

	      	console.log("Address NAMEEEEEEEEEEEEEEEEEEEEE:" + str);
	      
	      	var components = vm.address_details.address_components;

	      	if (typeof components === 'undefined') {
	        	console.log("No address has been given");

	      	}else{

	        	str = JSON.stringify(vm.address_details.geometry.location.lng);

	        	console.log("Geometry LAT:" + str);
	        

	        	str = JSON.stringify(components);

	        	//console.log("LAT:" + vm.address_details.geometry.location.lat);

	        	vm.gatheringAddress.location.coordinates = [vm.address_details.geometry.location.lng(), vm.address_details.geometry.location.lat()];

	        	constructImageUrl(width, height);

	        	//console.log("LOC Values:" + vm.gatheringAddress.loc);

	        	vm.gatheringAddress.formatted_address = vm.address_details.formatted_address;
	        	vm.gatheringAddress.name = vm.address_details.name;
	        	//console.log("Formatted Address:" + vm.address_details.formatted_address);

	        	console.log("ADDRESS:" + JSON.stringify(vm.gatheringAddress));

	        	//console.log("LNG:" + vm.gatheringAddress.loc[0]);

	        	components.forEach(function(types) {

	          		var component_type = types.types[0];

	          		console.log("Type:" + component_type);

	          		switch(component_type) {
	              		case 'country':
	                		//console.log('Country:' + types.long_name);
	                		vm.gatheringAddress.country = types.long_name;
                      vm.gatheringAddress.country_short = types.short_name;
	                		break;
		              	case 'locality':                
		                	//console.log('Locality:' + types.long_name);
		                	vm.gatheringAddress.locality = types.long_name;
		                	break;
		              	case 'sublocality_level_1':                
		                	//console.log('SubLocality:' + types.long_name);
		                	vm.gatheringAddress.locality = types.long_name;
		                	break;
		              	case 'administrative_area_level_1':                
		                	//console.log('State:' + types.long_name);
		                	vm.gatheringAddress.state_prov = types.long_name;
		                	break;
		              	case 'postal_code':                
		                	//console.log('Postal Code:' + types.long_name);
		                	vm.gatheringAddress.postal_code = types.long_name;
		                	break;
		              	default:
		                	//default code block
	            	}
	        	});
	       	}
	    }, true);

  		$scope.$watch("vm.start_date", function(date) {
        
	      	if(Object.prototype.toString.call(vm.start_date) !== '[object Date]') {
	        	console.log("We have an error with start date or time!!!!!!!!!!!!!!!!!!!!!!");

	        	vm.invalid_start_date = true;

	        	vm.formErrors.invalidDate = "The Start Date and Time is not valid";

	      	}else{

	        	//var tmpDate = new Date(vm.start_date);
	        	//tmpDate.setHours(vm.start_time.getHours());
	        	//tmpDate.setMinutes(vm.start_time.getMinutes());

	        	vm.newGathering.gathering_start_date_time = vm.start_date;
	        	console.log("Start Date has changed:" + vm.newGathering.gathering_start_date_time);

	        	if(vm.end_date.getTime() < vm.start_date.getTime()) {

	          		vm.end_date = vm.start_date;
	          		//vm.end_time = tmpDate;
	          		//vm.invalid_start_date = true;
	          		//vm.formErrors.invalidDate = "The Start Date cannot be after the End Date";
	        	} else {
	          		vm.invalid_start_date = false;
	          		vm.invalid_end_date = false;
	        	}

	      	}

	    }, true);

    
    	$scope.$watch("vm.end_date", function(date) {
        
      		if(Object.prototype.toString.call(vm.end_date) !== '[object Date]') {
        		console.log("We have an error with end date or time!!!!!!!!!!!!!!!!!!!!!!");

        		vm.invalid_end_date = true;

        		vm.formErrors.invalidDate = "The End Date and Time is not valid";
      		}else{

        		//var tmpDate = new Date(vm.start_date);
        		//tmpDate.setHours(vm.start_time.getHours());
        		//tmpDate.setMinutes(vm.start_time.getMinutes());

        		vm.newGathering.gathering_end_date_time = vm.end_date;
        		console.log("End Date has changed:" + vm.newGathering.gathering_end_date_time);

        		if(vm.end_date.getTime() < vm.start_date.getTime()) {

          			//vm.end_date = vm.start_date;
          			//vm.end_time = tmpDate;
          			vm.invalid_end_date = true;
          			vm.formErrors.invalidDate = "The End Date cannot be before the Start Date";
        		} else {
          			vm.invalid_start_date = false;
          			vm.invalid_end_date = false;
        		}
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

      	// ===============================================================================================
      	// Time related functions
      	// ===============================================================================================

      	//vm.start_time = new Date();
      	//vm.end_time = new Date();

      	vm.hstep = 1;
      	vm.mstep = 1;

      	vm.options = {
          	hstep: [1, 2, 3],
          	mstep: [1, 5, 10, 15, 25, 30]
      	};

      	vm.ismeridian = true;
        
      	vm.toggleMode = function() {
          	vm.ismeridian = ! vm.ismeridian;
      	};

      	// vm.update = function() {
      	//     var d = new Date();
      	//     d.setHours( 14 );
      	//     d.setMinutes( 0 );
      	//     vm.mytime = d;
      	// };

      	vm.changed = function () {
          	console.log('Time changed to: ' + vm.mytime);
      	};

      // vm.clearTime = function() {
      //     vm.start_time = null;
      //     vm.end_time = null;
      // };
      
    }
    
}());
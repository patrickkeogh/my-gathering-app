(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('CreateGatheringController', CreateGatheringController);
        
    CreateGatheringController.$inject = ['Authentication', 'DatabaseUtils'];


       
    function CreateGatheringController(Authentication, DatabaseUtils) {
      	var vm = this;
      
      	vm.message = "Hello";

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
	    	status: "Not Published"
	   	};

	   	vm.gatheringAddress = {
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

    		console.log("init called in Gathering");


        	//vm.gatheringAddress.loc = [43.6414378,-79.38935320000002];

        	var response = DatabaseUtils.getTypes();

	        response.then(function(data) {
	          vm.types = data;
	        });

	        response = DatabaseUtils.getTopics();

	        response.then(function(data) {
	          vm.topics = data;
	        });

	        vm.currentUser = Authentication.getCurrentUser();

	        vm.newGathering.owner = {
				ownerId: vm.currentUser._id,
				username: vm.currentUser.username,
				name: vm.currentUser.name
    		};
        
  	});










	    // ======================================================================================================
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
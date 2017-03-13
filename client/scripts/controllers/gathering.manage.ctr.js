(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('ManageGatheringController', Controller);
        
    Controller.$inject = ['$scope','$stateParams', 'filepickerService', 'gatheringAPI'];
       
    function Controller($scope, $stateParams, filepickerService, gatheringAPI) {
      	var vm = this;

      	vm.selectedGatheringId = $stateParams.id;

      	vm.gathering = {
      		picture: ''
      	};    	

      	function saveBanner(banner) {
			gatheringAPI.saveBanner(vm.selectedGatheringId, vm.gathering.picture)
			.then(function(data) {
	        	console.log(data);
	        	//vm.types = data.data;
	      	})
	      	.catch(function(err) {
	        	console.log('failed to upload banner ' + err);
	      	});

      	}

      	//Single file upload, you can take a look at the options
	    vm.upload = function(){
	        filepickerService.pick(
	            {
	                mimetype: 'image/*',
	                language: 'en',
	                services: ['CONVERT', 'COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
	                conversions: ['crop'],
	                cropRatio: 2/1,
	                cropMin: [300, 150],
	                // cropDim: [300, 150],
	                cropMax: [2160, 1080],
	                cropForce: true,
	                openTo: 'COMPUTER'
	            },
	            function(Blob){
	                console.log(JSON.stringify(Blob));
	                vm.gathering.picture = Blob;
	                $scope.$apply();
	            }
	        );
	    };
      
    }
}());



















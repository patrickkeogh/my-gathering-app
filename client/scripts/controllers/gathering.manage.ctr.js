(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('ManageGatheringController', controller);
       
    controller.$inject = ['$scope','$stateParams', 'filepickerService', 'gatheringAPI', '$uibModal'];

    angular
    .module('myGathering')
    .controller('ModalCtrl', modalCtr);

    modalCtr.$inject = ['$scope', '$uibModalInstance'];

    function modalCtr($scope, $uibModalInstance) {

    	var vm = this;

    	vm.ok = function () {
		    $uibModalInstance.close(vm.gatherings);
		};

		vm.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		};

    }
       
    function controller($scope, $stateParams, filepickerService, gatheringAPI, $uibModal) {

      	var vm = this;

      	vm.id = $stateParams.id;

      	vm.uploadedPicture = null;

      	angular.element(document).ready(function() {

	        console.log("init called in Gathering Info");

	        gatheringAPI.getGathering(vm.id)
	        .then(function(data) {
	          console.log(data.data);
	          vm.gathering = data.data[0];
	        })
	        .catch(function(err) {
	          console.log('failed to get gathering ' + err);
	        });

	       
	    }); 	

	    vm.openConfirmModal = function() {

      		var modalInstance = $uibModal.open({
      			animation: true,
      			ariaLabelledBy: 'modal-title',
      			ariaDescribedBy: 'modal-body',
      			backdrop: 'static',
      			size: 'sm',
      			templateUrl: '../views/modals/manage.banner.confirm.modal.html',
      			controller: 'ModalCtrl',
      			controllerAs: 'vm'
      		});

      		modalInstance.result.then(function (gatherings_in) {
      			console.log('Confirmation Received');

      			// Remove Banner
      			gatheringAPI.removeBanner(vm.id)
      			.then(function(data) {
      				console.log('data returned from remove banner call');
      				console.log(data);


      			})
      			.catch(function(err) {
      				console.log('failed to remove banner ' + err);
      			});
 
      		}, function() {
      			console.log('Modal dismissed at: ' + new Date());
      		});
	    };

      	vm.saveBanner = function() {
      		console.log('Save Banner called');
			gatheringAPI.saveBanner(vm.id, vm.uploadedPicture)
			.then(function(data) {
	        	//console.log('DataReturned' + JSON.stringify(data.data));
	        	vm.gathering.banner = vm.uploadedPicture;
	        	vm.uploadedPicture = null;
	      	})
	      	.catch(function(err) {
	        	console.log('failed to upload banner ' + err);
	      	});

      	};

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
	                vm.uploadedPicture = Blob;
	                $scope.$apply();
	            }
	        );
	    };

	    vm.removeBanner = function() {

	    	console.log('Remove image called');

	    	vm.uploadedPicture = null;
	    	//$scope.$apply();

	    };

	    vm.cancel = function() {

	    	vm.uploadedPicture = null;

	    };

      
    }
}());



















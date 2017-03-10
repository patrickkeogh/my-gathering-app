(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('CreateGatheringController', CreateGatheringController);
        
    CreateGatheringController.$inject = [];
       
    function CreateGatheringController() {
      	var vm = this;
      
      	vm.message = "Hello";
      
    }
    
}());
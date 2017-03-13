(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringInfoController', GatheringInfo);
        
    GatheringInfo.$inject = ['$stateParams'];
       
    function GatheringInfo($stateParams) {
      var vm = this;

      vm.selectedGatheringId = $stateParams.id;
      
      vm.message = "Hello";
      
    }
}());
(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringDashboard', GatheringDashboard);
        
    GatheringDashboard.$inject = ['$stateParams'];
       
    function GatheringDashboard($stateParams) {
      var vm = this;

      vm.selectedGatheringId = $stateParams.id;
            
      vm.message = "Hello";
      
    }
}());
(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringDashboardController', GatheringDashboard);
        
    GatheringDashboard.$inject = ['$stateParams', 'gatheringAPI'];
       
    function GatheringDashboard($stateParams, gatheringAPI) {
      var vm = this;

      vm.selectedGatheringId = $stateParams.id;
            
      vm.message = "Hello";

      angular.element(document).ready(function() {

        console.log("init called in Dashboard Info");

        gatheringAPI.getGathering(vm.selectedGatheringId)
        .then(function(data) {
          console.log(data.data);
          vm.gathering = data.data[0];
        })
        .catch(function(err) {
          console.log('failed to get gathering ' + err);
        });

       
      });




      
    }
}());
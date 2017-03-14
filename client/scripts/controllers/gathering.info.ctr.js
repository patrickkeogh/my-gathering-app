(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringInfoController', GatheringInfo);
        
    GatheringInfo.$inject = ['$stateParams'];
       
    function GatheringInfo($stateParams) {
      var vm = this;

      vm.selectedGatheringId = $stateParams.id;

      vm.gathering = {};

      angular.element(document).ready(function() {

        console.log("init called in Gathering Info");

        gatheringAPI.getGathering(vm.selectedGatheringId)
        .then(function(data) {
          console.log(data);
          vm.gathering = data.data;
        })
        .catch(function(err) {
          console.log('failed to get gathering ' + err);
        });

       
      });
      

      
    }
}());
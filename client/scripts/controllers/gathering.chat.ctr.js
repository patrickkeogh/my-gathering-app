(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringChatController', GatheringChat);
        
    GatheringChat.$inject = ['$stateParams'];
       
    function GatheringChat($stateParams) {
      var vm = this;

      vm.selectedGatheringId = $stateParams.id;
      
      vm.message = "Hello";
      
    }
}());
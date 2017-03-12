(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringsCreated', GatheringsCreated);
        
    GatheringsCreated.$inject = ['gatheringAPI'];
       
    function GatheringsCreated(gatheringAPI) {
      var vm = this;

      vm.message = "Hello";

      gatheringAPI.getGatherings()
        .then(function(data) {
          console.log(data);
          vm.types = data.data;
        })
        .catch(function(err) {
          console.log('failed to get gathering types ' + err);
        });
      
    }
}());
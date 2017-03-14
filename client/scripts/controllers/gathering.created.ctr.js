(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('GatheringsCreatedController', GatheringsCreated);
        
    GatheringsCreated.$inject = ['gatheringAPI', 'Authentication'];
       
    function GatheringsCreated(gatheringAPI, Authentication) {
      var vm = this;

      vm.currentPage = 1;      
      vm.recsPerPage = 10;
      
      vm.maxSize = 5;
      vm.gatherings = [];

      vm.message = "Hello";

      

      function getGatherings(query) {
        gatheringAPI.getGatherings(vm.currentPage, vm.recsPerPage, query)
        .then(function(data) {
          console.log(data);
          vm.gatherings = data.data;
        })
        .catch(function(err) {
          console.log('failed to get gathering types ' + err);
        });
      }

      angular.element(document).ready(function() {

        console.log("init called in Gathering");

        var query = {};

        query = {
          "owner.username": Authentication.getUsername()
        };

         getGatherings(query);
      });
      
    }
}());
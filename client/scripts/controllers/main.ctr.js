(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('MainController', MainController);
        
    MainController.$inject = [];
       
    function MainController() {
      var vm = this;
      
      vm.message = "Hello";
      
    }
}());
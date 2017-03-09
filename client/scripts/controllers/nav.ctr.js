/**
 * @ngdoc function
 * @name myGathering.controller:NavigationController
 * @description
 * # MainCtrl
 * Controller for nav views
 */

(function(){
  'use strict';
  angular
    .module('myGathering')
    .controller('NavigationController', NavigationController);
        
    NavigationController.$inject = [];
       
    function NavigationController() {
      var vm = this;
      
      vm.isAuthenticated = false;
      
      vm.message = "Hello";
      
    }
}());
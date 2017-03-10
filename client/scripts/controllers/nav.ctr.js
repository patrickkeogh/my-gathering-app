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
        
    NavigationController.$inject = ['$state', 'Authentication'];
       
    function NavigationController($state, Authentication) {
      var vm = this;
      
      vm.isAuthenticated = Authentication.isLoggedIn();

      if(vm.isAuthenticated) {
        vm.currentUser = Authentication.getCurrentUser();

      }

      vm.logout = function() {
          
          console.log('Logout method called');

          var response = Authentication.logout();

          response.then(function(data) {

            if(data.status === 200) {
                vm.showMessage = true;
                console.log("Success:" + data.data.status);
                vm.message = 'You have successfully logged out.';
                
                $state.go('login');

            }

          }, function() {


          });

      };
      
    }
}());
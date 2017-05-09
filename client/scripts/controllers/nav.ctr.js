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
        
    NavigationController.$inject = ['$state', '$stateParams', '$location', 'Authentication'];
       
    function NavigationController($state, $stateParams, $location, Authentication) {
      
      var vm = this;

      vm.isLoggedIn = Authentication.isLoggedIn();
      vm.currentUser = Authentication.getCurrentUser();

      //console.log('isLoggedIn:' + vm.isLoggedIn);
      //console.log('getCurrentUser:' + vm.currentUser);

      vm.selectedGatheringId = $stateParams.id;

      vm.state = $state.current.name;

      getSideBar();

      getJumbo();

      vm.closeAlert = function(index) {

        console.log('Close alert');
    
  };

      
      //console.log('location:' + $location.path());
      console.log('state:' + vm.state);

      function getJumbo() {
        return vm.state === 'main' ? vm.showJumbo = true : vm.showJumbo = false;
      }

      function getSideBar() {

        switch(vm.state) {
          case 'gathering-new':
          case 'gathering-created':
          case 'gathering-joined':
            vm.showSidebar = true;
            vm.src = 'views/includes/sidebar.manage.html';
            break;
          case 'gathering-dashboard':  
          case 'gathering-info': 
          case 'gathering-chat': 
          case 'gathering-pics':
          case 'gathering-manage-banner':           
            vm.showSidebar = true;
            vm.src = 'views/includes/sidebar.dashboard.html';
            break;
          default:
            // No side bar needed
            vm.showSidebar = false;
            vm.src = 'views/includes/sidebar.dashboard.html';
        }
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
        });
      };
      
    }
}());
(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$rootScope', '$state', 'Authentication'];

  function AuthController($rootScope, $state, Authentication) {
    var vm = this;

    vm.credentials = {
      name : "",
      username : "",
      password : ""
    };

    vm.onSubmit = function () {

      console.log('Submitting registration');

      //var rndPassword = Math.random().toString(36).slice(-8);
      vm.credentials.password = 'welcome'; //for testing only

      var response = Authentication.register(vm.credentials);
        response.then(function(data) {

          var str = JSON.stringify(data);
          console.log("response=" + str);

          if(data.status === 200) {
            vm.showError = true;
            console.log("Success:" + data.data.status);
            vm.errorMessage = 'Thank you for registering with MyGathering.com';
            $rootScope.justRegistered = true;
            $state.go('login');
          } else if(data.status === 500) {
            vm.showError = true;
            console.log("Error:" + data.data.err.message);

            if(data.data.err.message === 'No username was given') {
              vm.errorMessage = 'Error: No email was given';
            }else if(data.data.err.message === 'A user with the given username is already registered') {
              vm.errorMessage = 'Error: The given email address has alreadcy been used to register.';
            }else {
              vm.errorMessage = data.data.err.message;
            }            

          }else{

            console.log("status:" + data.data.status);
          }

        }, function() {

        }); 


    };



  }

})();





// (function() {
//   'use strict';

//   angular
//     .module('myGathering')
//     .controller('AuthController', AuthController);

//   AuthController.$inject = ['$scope', 'Auth', '$state', '$window'];

//   function AuthController($scope, Auth, $state, $window) {
//     var vm = this;

//     vm.user = {};
//     vm.errors = {};

//     vm.errorMessage = "hey dumb ass";

//     //var rndPassword = Math.random().toString(36).slice(-8);

//     //vm.newUser.password = rndPassword;
//     vm.user.password = 'welcome'; //for testing only

//     // if (Auth.isLoggedIn()) {
//     //   $state.go('main');
//     // }

//     vm.register = function(isValid) {
//       console.log('Register method called');

//       if(isValid){

//         var rndPassword = Math.random().toString(36).slice(-8);

//         //vm.newUser.password = rndPassword;
//         vm.user.password = 'welcome'; //for testing only

//         console.log("NEW USER TO REGISTER:" + JSON.stringify(vm.user));



//         var response = Auth.register(vm.user);

//         response.then(function(data) {

//           console.log("DATA RETURNED:" + JSON.stringify(data));

//           if(data.status === 200) {
//             vm.showError = true;
//             console.log("Success:" + data.data.status);
//             vm.errorMessage = 'Thank you for registering with MyGathering.com';
//             //$rootScope.justRegistered = true;
//             $state.go('login');
//             //vm.sendEmail();
//           } else if(data.status === 422) {

//             vm.showError = true;
//             console.log("Error:" + data.data.message);

//             if(data.data.message === 'No username was given') {
//               vm.errorMessage = 'Error: No email was given';
//             }else if(data.data.message === 'A user with the given username is already registered') {
//               vm.errorMessage = 'Error: The given email address has alreadcy been used to register.';
//             }else {
//               vm.errorMessage = data.data.message;
//             }            

//           }else{

//             console.log("status:" + data.data.status);
//           }

//         }, function() {

//         }); 

//     }else{
//             console.log("Form is not valid");      
//     }
//   };

//     $scope.loginOauth = function(provider) {
//       $window.location.href = '/auth/' + provider;
//     };
//   }
// })();



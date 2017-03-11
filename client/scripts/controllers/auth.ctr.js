(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$rootScope', '$state', 'Authentication'];

  function AuthController($rootScope, $state, Authentication) {
    var vm = this;

    vm.justRegistered = $rootScope.justRegistered;

    vm.credentials = {
      name : "",
      username : "",
      password : ""
    };

    angular.element(document).ready(function() {

      //vm.init();

      console.log("init called");

      vm.justRegistered = $rootScope.justRegistered;

      if(vm.justRegistered) {
        vm.message = 'Your password has been emailed to the addess you used for registration.  You should change your password after signing in the first time.';
        console.log("init:just registered= true");
      }

    });

    vm.login = function(isValid) {

      console.log('Submitting Login Request');

      if(isValid) {
        var response = Authentication.login(vm.credentials);

        response.then(function(data) {

          //console.log("ResponseDataInController=" + JSON.stringify(data));

          if(data.status === 200) {
            
            console.log("Success:" + data.data.status);
            vm.message = 'You have successfully logged in.';
            //Globals.setUserStatus(Constants.UserStatus.authenticated);
            $state.go('main');

          }else{
            vm.showMessage = true;
            console.log("status:" + str);
            vm.message = data.data.err.message;
          }


        }, function() {

        });


      }

    };

    vm.register = function () {

      console.log('Submitting registration');

      //var rndPassword = Math.random().toString(36).slice(-8);
      vm.credentials.password = 'welcome'; //for testing only

      var response = Authentication.register(vm.credentials);
        response.then(function(data) {

          //console.log("response=" + JSON.stringify(data));

          if(data.status === 200) {
            $rootScope.justRegistered = true;
            $state.go('login');
          } else if(data.status === 400) {
            vm.showError = true;
            console.log("Error:" + data.data.err);

            if(data.data.err.message === 'No username was given') {
              vm.errorMessage = 'Error: No email was given';
            }else if(data.data.err === 'The supplied email address has already be used to register!') {
              vm.errorMessage = 'Error: ' + data.data.err;
            }else {
              vm.errorMessage = data.data.err;
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



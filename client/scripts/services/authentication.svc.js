(function () {

  angular
    .module('myGathering')
    .service('Authentication', authentication);

  authentication.$inject = ['$http', '$window'];

  function authentication ($http, $window) {

    var herokuUrl = 'https://my-gathering.herokuapp.com';

    this.register = function(user) {

        url = herokuUrl + '/api/register';

        //http://localhost:3000/authenticate/register

        console.log("Register Url:" + url);



        return $http.post(url, user).
        then(function(response) {
            return response;
        }, function(response) {
            str = JSON.stringify(response.status);
            //console.log("response=" + str);
            return response;
            //alert("Error registering:" + response);
        });
    };



  }


})();
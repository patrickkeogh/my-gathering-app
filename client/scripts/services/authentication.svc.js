(function () {

  angular
    .module('myGathering')
    .service('Authentication', authentication);

  authentication.$inject = ['$http', '$window', 'Constants'];

  function authentication ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mygathering-token'] = token;
    };

    var removeToken = function (token) {
      $window.localStorage.removeItem('mygathering-token');
    };

    var getToken = function () {
      return $window.localStorage['mygathering-token'];
    };

    this.getCurrentUser = function() {
      if(this.isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        //console.log('payload exp:' + JSON.stringify(payload._doc));

        return {
          username : payload._doc.username,
          name : payload._doc.name,
          _id: payload._doc._id
        };
      }
    };

    this.isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        //console.log('We have a token');
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        //console.log('payload exp:' + JSON.stringify(payload.exp));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    this.register = function(user) {

        url = herokuUrl + '/api/register';

        //http://localhost:3000/authenticate/register

        console.log("Register Url:" + url);

        return $http.post(url, user).
        then(function(data) {

            return data;
        }, function(response) {
            return response;
            //alert("Error registering:" + response);
        });
    };

    this.login = function(user) {

      url = Constants.HEROKU_URL + '/api/login';

      return $http.post(url, user).
      then(function(data) {

        //console.log("ResponseData=" + JSON.stringify(data));

        saveToken(data.data.token);

        return data;
      
      }, function(response) {
           console.log("Login Error=" + JSON.stringify(response));
          return response;
      });

    };

    this.logout = function() {

      console.log("LOGOUT CALLED");

      url = Constants.HEROKU_URL + '/api/logout';

      return $http.get(url).
      then(function(data) {

        removeToken();

        return data;
      }, function(err) {
        console.log(err);
        return err;
      });        

    };
  }


})();
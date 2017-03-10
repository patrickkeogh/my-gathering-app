(function() {

  angular
    .module('myGathering')
    .service('DatabaseUtils', DatabaseUtils);

  DatabaseUtils.$inject = ['$http', 'Authentication', 'Constants'];

  function DatabaseUtils ($http, Authentication, Constants) {
    var url;

    var getTypes = function() {

      url = Constants.HerokuUrl + '/gathering/types';

      return $http.get(url).then(function(data) {
         
        console.log("Get Types:" + JSON.stringify(data.data));

        return data.data;
      }, function(error) {
        console.log("ERROR Get Types:" + JSON.stringify(error));
        return error;
      });
    };

    var getTopics = function() {

      url = Constants.HerokuUrl + '/gathering/topics';

      return $http.get(url).then(function(data) {
         
        console.log("Get Topics:" + JSON.stringify(data.data));

        return data.data;
      }, function(error) {
        console.log("ERROR Get Topics:" + JSON.stringify(error));
        return error;
      });
    };

    // var getProfile = function () {
    //   return $http.get('/api/profile', {
    //     headers: {
    //       Authorization: 'Bearer '+ authentication.getToken()
    //     }
    //   });
    // };

    return {
      getTypes: getTypes,
      getTopics: getTopics
    };
  }

})();
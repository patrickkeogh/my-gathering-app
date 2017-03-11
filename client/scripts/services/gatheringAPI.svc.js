(function() {

  angular
    .module('myGathering')
    .service('gatheringAPI', gatheringAPI);

  gatheringAPI.$inject = ['$http', 'Authentication', 'Constants'];

  function gatheringAPI ($http, Authentication, Constants) {

    var url = Constants.HEROKU_URL + '/gathering';

    var getTypes = function() {
      return $http.get(url + '/type');
    };

    var getTopics = function() {
      return $http.get(url + '/topic');
    };

    var createGathering = function(gathering) {
      return $http.post(url, gathering, {
        headers: {
            'x-access-token': Authentication.getToken
        } 
      });
    };

    return {
      getTypes: getTypes,
      getTopics: getTopics,
      createGathering: createGathering
    };
  }

})();
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

    var getGatherings = function(page, recsPerPage, query) {
      var queryString = '?page=' + page + '&recsPerPage=' + recsPerPage;

      query ={};
      query = {
        "owner.username": "patrickkeogh@kantechprogramming.com"
      };

      return $http.get(url + queryString, {
            params: {query}
        });
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
      getGatherings: getGatherings,
      createGathering: createGathering
    };
  }

})();
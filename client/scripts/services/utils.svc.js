(function () {

  angular
  .module('myGathering')
  .service('Utils', utils);

  utils.$inject = ['$rootScope'];

  function utils ($rootScope) {

    var blankGathering = {
      //id: 1,
      name:"", 
      description: "",
      location: {}, 
      type: "",    
      topic: "", 
      gathering_start_date_time: "",
      gathering_end_date_time: "",
      directions: "",
      access: "Public",
      notes: "",
      status: "Not Published",
      owner: {}
    };

    var blankLocation = {
      location: {
        "type": "Point",
        "coordinates": [-79.3790818, 43.64352050000001] //long, lat for mongo
      },
      country: '',
      country_short: '',
      formatted_address: '',
      locality: '',
      postal_code: '',
      state_prov: '',
      name: '',
      notes: ''
    };

    var dateSearchOptions = [
      {
        name: 'No Date Filter',
        value: 0
      },
      {
        name: 'Today',
        value: 1
      },
      {
        name: 'Tomorrow',
        value: 2
      },
      {
        name: 'One week from',
        value: 3
      },
      {
        name: 'One month from',
        value: 4
      },
      {
        name: 'One year from',
        value: 5
      }

    ];

    var distanceOptions = [
      {
        name: 'No distance limit',
        value: 1000000000
      },
      {
        name: 'Within 5 km of',
        value: 5000

      },
      {
        name: 'Within 10 km of',
        value: 10000
      },
      {
        name: 'Within 25 km of',
        value: 25000
      },
      {
        name: 'Within 50 km of',
        value: 50000
      },
      {
        name: 'Within 100 km of',
        value: 100000
      }
    ];

    var query = null;

    var getSearchQuery = function() {
      console.log('getSearchQuery:' + JSON.stringify(query));
      return query;
    };

    var setSearchQuery = function(value) {
      console.log('setSearchQueryCalled:' + JSON.stringify(value));
      $rootScope.$broadcast('event:searchQueryChanged');
      this.query = value;
    };

    var getNewGatheringTemplate = function() {
      return blankGathering;
    };

    var getNewLocationTemplate = function() {
      return blankLocation;
    };

    var getDistanceSearchOptions = function() {
      return distanceOptions;
    };

    var getDateSearchOptions = function() {
      return dateSearchOptions;
    };


    return {
      getNewGatheringTemplate: getNewGatheringTemplate,
      getNewLocationTemplate: getNewLocationTemplate,
      getSearchQuery: getSearchQuery,
      setSearchQuery: setSearchQuery,
      getDistanceSearchOptions: getDistanceSearchOptions,
      getDateSearchOptions: getDateSearchOptions
    };


    


  }


})();
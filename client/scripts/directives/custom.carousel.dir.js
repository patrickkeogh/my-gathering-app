(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('myGathering')
    .directive('customCarousel', customCarousel);

  customCarousel.$inject = ['$interval', '$window', '$compile', '$templateCache'];

  function customCarousel($interval, $window, $compile, $templateCache) {

    var directive = {
      restrict: 'E', //E = element, A = attribute, C = class, M = comment 
      replace: true,
      transclude: true, //give access to the 5th param in link
      scope: {
        gatherings: '=data',
        action: '&'
      },

        // scope: {
        //Local scope properties:  
        // title: '@'  in html this would be title="something"   
        // @ reads the attribute value, = provides two-way binding with outside $scope, & works with functions
        // },
      // template: '<ul><li ng-repeat="row in gatherings">{{ row.name }}</li></ul>' +
      // '<button class="btn" ng-click="action()"></button>',

      // template: 
      // '<div class="col-xs-12">' +
      // '<div class="carousel slide" id="myCarousel">' +
      //   '<div class="carousel-inner">' +
      //     '<div class="item active">' +
      //       '<div class="col-xs-3">' +
      //         '<div class="list-panel">1</div>' +
      //       '</div>' +
      //     '</div>' +

      //     '<div class="item" ng-repeat="row in gatherings">' +
      //       '<div class="col-xs-3">' +
      //         '<div class="list-panel">{{row.name}}</div>' +
      //       '</div>' +
      //     '</div>' +

          
      //   '</div>' +
      //   '<a class="left carousel-control" href="#myCarousel" data-slide="prev"><i class="glyphicon glyphicon-chevron-left"></i></a>' +
      //   '<a class="right carousel-control" href="#myCarousel" data-slide="next"><i class="glyphicon glyphicon-chevron-right"></i></a>' +

      // '</div></div>',

      // templateUrl: '../views/includes/template.html',

        //controller: controllerFunction, //Embed a custom controller in the directive
        link: function (scope, element, attrs, ctrl, transclude) { 

          var template, timeoutId;

          var count = 0;

          if (scope.$last){
      // iteration is complete, do whatever post-processing
      // is necessary
      element.parent().css('border', '1px solid blue');
    }

        

          scope.$watch('gatherings', function(){
            // var templateUrl = '../views/includes/template.html';
            // var data = $templateCache.get(templateUrl);
            // element.html(data);

            createTemplate();
            $compile(element.contents())(scope);

            console.log('Gathering Changed, watchin Directive');

          });

          function createTemplate() {

            var recs = scope.gatherings;

            console.log('Rec Count:' + recs.length);

            template = 
              '<div class="col-xs-12">' +
              '<div class="container">';

            for(var b =1; b < recs.length; b++) {

              template += '<div class="item">' +
                          '<div class="col-xs-3">' +
                          '<div class="list-panel">' + recs[b].name + '</div>' +
                          '</div>' +
                          '</div>'; 


              
            }  




            template +=                  
                '</div>' +
                '<a class="left carousel-control" href="#myCarousel" data-slide="prev"><i class="glyphicon glyphicon-chevron-left"></i></a>' +
                '<a class="right carousel-control" href="#myCarousel" data-slide="next"><i class="glyphicon glyphicon-chevron-right"></i></a>' +

              '</div></div>';

              element.html(template);


          }

          // function updateTime() {
          //   element.text(count + 1);
          // }

          // scope.$watch(attrs.myCurrentTime, function(value) {
          //   format = value;
          //   updateTime();
          // });

          element.on('$destroy', function() {
            $interval.cancel(timeoutId);
          });


          // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
              createTemplate(); // update DOM
            }, 5000);




        } //DOM manipulation
    };

    //var template = '<div class="list-panel"></div>';

    return directive;

    

    
  }
}());



// function ($scope, element, attrs) {
//             element.bind('click', function () {
//                 element.html('You clicked me!');
//             });
//             element.bind('mouseenter', function () {
//                 element.css('background-color', 'yellow');
//             });
//             element.bind('mouseleave', function () {
//                 element.css('background-color', 'white');
//                 element.html('Click Here!');
//             });



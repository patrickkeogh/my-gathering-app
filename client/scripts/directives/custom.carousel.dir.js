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
        gatherings: '=data'
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
          
      //   '</div>' +
      //   '<a class="left carousel-control" href="#myCarousel" data-slide="prev"><i class="glyphicon glyphicon-chevron-left"></i></a>' +
      //   '<a class="right carousel-control" href="#myCarousel" data-slide="next"><i class="glyphicon glyphicon-chevron-right"></i></a>' +

      // '</div></div>',

      // templateUrl: '../views/includes/template.html',

        //controller: controllerFunction, //Embed a custom controller in the directive
        link: function (scope, element, attrs, ctrl, transclude) { 

          scope.$on('windowResize', function(event, currentBreakpoint, previousBreakpoint) {

              console.log(currentBreakpoint, previousBreakpoint);
          });
        

          var template, timeoutId;

          var count = 0;   

          var chunksArray = []; 

          scope.$watch('gatherings', function(newValue, oldValue) {

            if (newValue !== oldValue) {  
              // var templateUrl = '../views/includes/template.html';
              // var data = $templateCache.get(templateUrl);
              element.html(createTemplate());

              //createTemplate();
              $compile(element.contents())(scope);

              // $(document).ready(function() {
              //   $('.carousel').carousel({
              //     interval: 6000
              //   });
              // });

              console.log('Gathering Changed, watchin Directive');

            }            

          });

          function createChunks (itemsPerChunk) {
            var tempArray = [];
            
            for (var i = 0, j = scope.gatherings.length; i < j; i += itemsPerChunk) {
                tempArray = scope.gatherings.slice(i, i + itemsPerChunk);  

                chunksArray.push(tempArray);
            }
            console.log('Chunks in Array:' + chunksArray.length);
          }

          function createTemplate () {

            var itemsPerSlide = 3;

            createChunks(itemsPerSlide);

            console.log('Rec Count:' + scope.gatherings.length);
            console.log('Chunk Count:' + chunksArray.length);


            var template = 
              '<div id="myCarousel" class="row carousel slide" data-ride="carousel">' +
              '<div class="carousel-inner">' +
              '<div class="item" ng-class="{active: $first }" ng-repeat="row in chunksArray">' +
              '<ul class="thumbnails">' +
              '<li class="col-xs-12 col-sm-6 col-md-4" ng-repeat="item in row">' +     
                '<div class="list-panel-mobile">' +
                  '<div class="panel-banner-wrapper-mobile">' +
                    '<div class="panel-banner-mobile">' +
                      '<img class="img-mobile img-responsive" ng-src="{{item.banner.url}}">' +               
                    '</div>' +
                    '<div class="panel-cost-mobile">FREE</div>' +                                 
                  '</div>' +
                '</div>' +
              '</li>' +

              '</ul>' +


              '</div></div></div>';


              return template;

            
          }





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


// <div id="myCarousel" class="row carousel slide" data-ride="carousel">

//       <div class="carousel-inner">

//         <div class="item"  ng-class="{active: $first }" ng-repeat="row in vm.gatherings">        
//           <ul class="thumbnails" >
//             <li class="col-sm-6">      
//               <div class="thumbnail">
//                 <a href="#"><img src="http://placehold.it/360x240" alt=""></a>
//               </div>
//               <div class="caption-box">
//                 <h4>{{row.name}}</h4>
//                 <p>Nullam Condimentum Nibh Etiam Sem</p>
//                 <a class="btn btn-success btn-mini" href="#">Read More</a>
//               </div>
//             </li>

//             <li class="col-sm-6">      
//               <div class="thumbnail">
//                 <a href="#"><img src="http://placehold.it/360x240" alt=""></a>
//               </div>
//               <div class="caption-box">
//                 <h4>{{row[$index].name}}</h4>
//                 <p>Nullam Condimentum Nibh Etiam Sem</p>
//                 <a class="btn btn-success btn-mini" href="#">Read More</a>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
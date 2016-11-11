'use strict';

angular.module('core').directive('imageOrient', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      // scope: {
      //   dir: "@"
      // },
      link: function (scope, element, attr) {


        attr.$observe('imageOrient', function(value) {
          if(value) {

            var width = element[0].naturalWidth || element[0].width;
            var height = element[0].naturalHeight || element[0].height;

            console.log(width, height);

            console.log(element[0]);


            value = parseInt(value, 10);

            value = 6;

            exifOrient(element[0], value, function (err, canvas) {
              if(err) {
                console.error(err);
              } else {
                console.log(canvas);
                element[0].src = canvas.toDataURL();
              }



            });
          }
          // var orient = scope.dir;

        });



      }
    };
  }]);

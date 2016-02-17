(function(module) {
try { module = angular.module("angular.chips"); }
catch(err) { module = angular.module("angular.chips", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/templates/chip.tmpl.html",
    "<!-- <div ng-transclude ng-repeat=\"name in chips.list\"> -->\n" +
    "<div ng-transclude>\n" +
    "</div>");
}]);
})();

(function() {
  angular.module('angular.chips',[])
    .directive('chip', Chip);
  function Chip() {
    return {
      restrict: 'E',
      require: '^chips',
      templateUrl: 'src/templates/chip.tmpl.html',
      transclude: true,
    }
  };
})();

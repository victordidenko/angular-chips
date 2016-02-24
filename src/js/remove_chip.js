(function() {
    angular.module('angular.chips')
        .directive('removeChip', RemoveChip);

    function RemoveChip() {
        return {
            restrict: 'A',
            require: '^chips',
            link: function(scope, iElement, iAttrs, chipsCtrl) {
                function deleteChip() {
                    chipsCtrl.removeChip(scope.chip, scope.$index);
                }
                iElement.on('click', function() {
                    deleteChip();
                });
                scope.$on('chip:delete', function() {
                    deleteChip();
                });
            }
        }
    }
})();

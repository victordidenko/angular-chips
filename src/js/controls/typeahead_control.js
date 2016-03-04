(function() {
    angular.module('angular.chips')
        .directive('typeaheadControl', TypeaheadControl);

    /*
     * It's for bootstrap typeahead component to pass the value to chips directive
     */
    function TypeaheadControl() {
        return {
            restrict: 'A',
            require: ['ngModel', '^chips'],
            link: function(scope, iElement, iAttrs, controller) {
                var ngModelCtrl = controller[0],
                    chipsCtrl = controller[1];
                ngModelCtrl.$render = function() {
                    if (!ngModelCtrl.$modelValue)
                        return;
                    chipsCtrl.addChip(ngModelCtrl.$modelValue);
                    event.target.value = "";
                }
            }
        }
    }
})();

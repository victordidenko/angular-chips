(function() {
    angular.module('angular.chips')
        .directive('ngModelControl', NGModelControl);

    /*
     * It's for input element which uses ng-model directive
     * example: bootstrap typeahead component
     */
    function NGModelControl() {
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

                iElement.on('focusin', function() {
                    chipsCtrl.setFocus(true);
                });
                iElement.on('focusout', function() {
                    chipsCtrl.setFocus(false);
                });
            }
        }
    }
})();

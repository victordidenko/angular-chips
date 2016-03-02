(function() {
    angular.module('sample')
        .directive('typeaheadControl', TypeaheadControl);

    function TypeaheadControl() {
        return {
            restrict: 'A',
            require: ['ngModel','^chips'],
            link: function(scope, iElement, iAttrs, controller) {
            	var ngModelCtrl = controller[0], chipsCtrl = controller[1];
                ngModelCtrl.$render = function() {
                    if(!ngModelCtrl.$modelValue)
                    	return;
                    chipsCtrl.addChip(ngModelCtrl.$modelValue);
                    event.target.value = "";
                }
            }
        }
    }
})();

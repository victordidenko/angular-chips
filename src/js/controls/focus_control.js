(function() {
    angular.module('angular.chips')
        .directive('focusControl', FocusControl);

    /*
     * handling input focus here
     */
    function FocusControl() {
        return {
            restrict: 'A',
            require: '^chips',
            link: FocusControlLinkFun,
        }
    };

    function FocusControlLinkFun(scope, iElement, iAttrs, chipsCtrl) {
        iElement.on('focusin', function() {
            chipsCtrl.setFocus(true);
        });
        iElement.on('focusout', function() {
            chipsCtrl.setFocus(false);
        });
    };
})();

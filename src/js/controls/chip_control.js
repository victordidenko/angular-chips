(function() {
    angular.module('angular.chips')
        .directive('chipControl', ChipControl);

    /*
     * It's for normal input element 
     * It send the value to chips directive when press the enter button
     */
    function ChipControl() {
        return {
            restrict: 'A',
            require: '^chips',
            link: ChipControlLinkFun,
        }
    };

    function ChipControlLinkFun(scope, iElement, iAttrs, chipsCtrl) {
        iElement.on('keypress', function(event) {
            if (event.keyIdentifier === 'Enter') {
                chipsCtrl.addChip(event.target.value);
                event.target.value = "";
            }
        });

        iElement.on('focusin', function() {
            chipsCtrl.setFocus(true);
        });
        iElement.on('focusout', function() {
            chipsCtrl.setFocus(false);
        });
    };
})();

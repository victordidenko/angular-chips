(function() {
    angular.module('angular.chips')
        .directive('chipControl', ChipControl);

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
    };
})();

(function() {
    angular.module('angular.chips')
        .directive('removeChip', RemoveChip);

    function RemoveChip() {
        return {
            restrict: 'A',
            require: '^?chips',
            link: function(scope, iElement, iAttrs, chipsCtrl) {

                function getCallBack(scope, prop) {
                    var target;
                    if (prop.search('\\(') > 0) {
                        prop = prop.substr(0, prop.search('\\('));
                    }
                    if (prop !== undefined) {
                        if (prop.split('.').length > 1) {
                            var levels = prop.split('.');
                            target = scope;
                            for (var index = 0; index < levels.length; index++) {
                                target = target[levels[index]];
                            }
                        } else {
                            target = scope[prop];
                        }
                    }
                    return target;
                };

                function findScope(scope, prop) {
                    if (!scope.hasOwnProperty(prop.split('.')[0])) {
                        return findScope(scope.$parent, prop)
                    }
                    return scope;
                };

                function deleteChip() {
                    var callBack, deleteIt = true;
                    if (iAttrs.hasOwnProperty('removeChip')) {
                        callBack = getCallBack(findScope(scope, iAttrs.removeChip), iAttrs.removeChip);
                    }
                    deleteIt = callBack(scope.chip);
                    if (deleteIt)
                        chipsCtrl.removeChip(scope.chip, scope.$index);
                };

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

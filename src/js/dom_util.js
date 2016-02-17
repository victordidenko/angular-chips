(function() {
    angular.module('angular.chips')
        .factory('DomUtil', function() {
            return DomUtil;
        });
    /*Dom related functionality*/
    function DomUtil(element) {
        /*
         * addclass will append class to the given element
         * ng-class will do the same functionality, in our case
         * we don't have access to scope so we are using this util methods
         */
        var utilObj = {};

        utilObj.addClass = function(className) {
            utilObj.removeClass(element, className);
            element.attr('class', element.attr('class') + ' ' + className);
            return utilObj;
        };

        utilObj.removeClass = function(className) {
            var classes = element.attr('class').split(' ');
            var classIndex = classes.indexOf(className);
            if (classIndex !== -1) {
                classes.splice(classIndex, 1);
            }
            element.attr('class', classes.join(' '));
            return utilObj;
        };

        utilObj.attr = function(attrName) {
            function hasAttribute(element, attrName) {
                var result = element.attr(attrName)
                if (result !== undefined)
                    return result

                if (element.children().length > 0) {
                    return hasAttribute(element.children(), attrName);
                } else {
                    return result;
                }
            }

            return angular.extend([hasAttribute(element, attrName)], utilObj);
        };

        return utilObj;
    }
})();

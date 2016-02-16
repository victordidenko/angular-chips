(function() {
    angular.module('angular.chips')
        .service('DomUtil', DomUtil);

    function DomUtil() {
        return {
            addClass: function(element, className) {
                this.removeClass(element, className);
                element.attr('class', element.attr('class') + ' ' + className);
            },
            removeClass: function(element, className) {
                var classes = element.attr('class').split(' ');
                var classIndex = classes.indexOf(className);
                if (classIndex !== -1) {
                    classes.splice(classIndex, 1);
                }
                element.attr('class', classes.join(' '));
            }
        }
    }
})();

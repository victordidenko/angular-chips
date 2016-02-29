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

        /*
         * for defer flow '<chips defer' 
         * attaching data to binded string 
         *
         * example:
         *
         *  <chips defer>
         *   <chip-tmpl>
         *   {{chip}}
         *  </chip-tmpl>
         *  </chips>

         *  will become
         *
         *   <chips defer>
         *   <chip-tmpl>
         *   {{chip.data}}
         *   </chip-tmpl>
         *  </chips>           

         *  And
         *
         *  <chips defer>
         *   <chip-tmpl>
         *   {{chip.firstName}}
         *  {{chip.lastName}}
         *  </chip-tmpl>
         *  </chips>

         *  will become
         *
         *  <chips defer>
         *  <chip-tmpl>
         *   {{chip.data.firstName}}
         *   {{chip.data.lastName}}
         *   </chip-tmpl>
         *  </chips>
         */
        utilObj.attachDataObjToTextNode = function() {
            var textNode, bindedData, bindedDataSuffix;
            var textNode = getChipTextNode(element);
            if (textNode !== null) {
                bindedData = textNode.data.trim();
                bindedData = bindedData.substr(2, bindedData.length - 4);
                if (bindedData === 'chip') {
                    bindedData = bindedData + '.data';
                } else {
                    bindedDataSuffix = bindedData.substr(4);
                    bindedData = 'chip' + bindedDataSuffix;
                }
                textNode.data = '{{' + bindedData + '}}';
            }
        };

        function getChipTextNode(element) {
            var contents = element.contents(),
                index = 0,
                result = null;
            for (index = 0; index < contents.length; index++) {
                if (contents[index].toString() === '[object Text]' && contents[index].data.trim().indexOf('{{chip') !== -1) {
                    result = contents[index];
                    break;
                }
            }

            if (result !== null)
                return result;

            var childIndex = 0;
            if (element.children().length > 0) {
                return getChipTextNode(element.children());
            }

            return null;
        };

        return utilObj;
    }
})();

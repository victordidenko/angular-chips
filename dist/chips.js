(function() {
  angular.module('angular.chips',[])
    .directive('chip', Chip);
  function Chip() {
    return {
      restrict: 'E',
      require: '^chips',
      templateUrl: 'src/templates/chip.tmpl.html',
      transclude: true,
    }
  };
})();

(function() {
    angular.module('angular.chips')
        .directive('chips', Chips)
        .controller('chipsController', ChipsController)

    function Chips($compile, $timeout, DomUtil) {

        function linkFun(scope, iElement, iAttrs, ngModelCtrl) {
            if ((error = validation(iElement)) !== undefined) {
                throw error;
            }

            scope.chips.addChip = function(data) {
                var modified = scope.render({ val: data });
                scope.chips.list.push(modified);
                ngModelCtrl.$setViewValue(scope.chips.list);
            };

            ngModelCtrl.$render = function() {
                scope.chips.list = angular.copy(ngModelCtrl.$modelValue);
            }

            var rootDiv = angular.element('<div></div>');
            var tmpl = iElement.find('chip-tmpl').remove();
            tmpl.attr('ng-repeat', 'chip in chips.list track by $index');
            rootDiv.append(tmpl);
            var node = $compile(rootDiv)(scope);
            iElement.prepend(node);

            iElement.on('click',function(){
                iElement.find('input')[0].focus();
            });

            DomUtil.addClass(iElement,'chip-out-focus');
        }

        return {
            restrict: 'E',
            scope: {
                render: '&'
            },
            transclude: true,
            require: 'ngModel',
            link: linkFun,
            controller: 'chipsController',
            controllerAs: 'chips',
            templateUrl: 'src/templates/chips.tmpl.html'
        }

    };

    function validation(element) {
        var error;
        if (element.find('chip-tmpl').length === 0) {
            error = 'should have chip-tmpl';
        } else {
            if (element.children().length > 1) {
                error = 'should have only one chip-tmpl';
            } else if (element.children().length < 1) {
                error = 'should have one chip-tmpl';
            }
        }
        return error;
    }

    function ChipsController($scope, $element, DomUtil) {
        this.setFocus = function(flag) {
            if(flag){
                DomUtil.removeClass($element,'chip-out-focus')
                DomUtil.addClass($element,'chip-in-focus')
            }else{
                DomUtil.removeClass($element,'chip-in-focus')
                DomUtil.addClass($element,'chip-out-focus')
            }
        }
    }
})();

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
        iElement.on('focusin', function() {
            chipsCtrl.setFocus(true);
        });
        iElement.on('focusout', function() {
            chipsCtrl.setFocus(false);
        });
    };
})();

(function(module) {
try { module = angular.module("angular.chips"); }
catch(err) { module = angular.module("angular.chips", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/templates/chip.tmpl.html",
    "<!-- <div ng-transclude ng-repeat=\"name in chips.list\"> -->\n" +
    "<div ng-transclude>\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("angular.chips"); }
catch(err) { module = angular.module("angular.chips", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/templates/chips.tmpl.html",
    "<div ng-transclude></div>\n" +
    "");
}]);
})();

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

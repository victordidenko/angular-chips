(function() {
    angular.module('angular.chips', [])
        .directive('chips', Chips)
        .controller('chipsController', ChipsController);

    function isPromiseLike(obj) {
        return obj && angular.isFunction(obj.then);
    }

    function Chips($compile, $timeout, DomUtil) {
        function linkFun(scope, iElement, iAttrs, ngModelCtrl) {
            if ((error = validation(iElement)) !== undefined) {
                throw error;
            }
            /*addChips method should be called by input control. pls check the input_control.js*/
            scope.chips.addChip = function(data) {
                var modified;
                scope.render !== undefined ? modified = scope.render({ data: data }) : modified = data;
                isPromiseLike(modified) ? modified.then(update) : update();

                function update() {
                    scope.chips.list.push(modified);
                    ngModelCtrl.$setViewValue(scope.chips.list);
                }
            };
            /*removeChips method should be called by input control. pls check the input_control.js*/
            scope.chips.deleteChip = function(index) {
                scope.chips.list.splice(index, 1);
                ngModelCtrl.$setViewValue(scope.chips.list);
            }

            ngModelCtrl.$render = function() {
                scope.chips.list = angular.copy(ngModelCtrl.$modelValue);
            }

            /*Below code will extract the chip-tmpl and compile inside the chips directive scope*/
            var rootDiv = angular.element('<div></div>');
            var tmpl = iElement.find('chip-tmpl').remove();
            tmpl.attr('ng-repeat', 'chip in chips.list track by $index');
            rootDiv.append(tmpl);
            var node = $compile(rootDiv)(scope);
            iElement.prepend(node);

            iElement.on('click', function(event) {
                if (event.target.nodeName === 'CHIPS')
                    iElement.find('input')[0].focus();
            });

            DomUtil(iElement).addClass('chip-out-focus');
        }

        return {
            restrict: 'E',
            scope: {
                /*optional callback, this will be called before rendering the data, user can modify the data before it's rendered*/
                render: '&?'
            },
            transclude: true,
            require: 'ngModel',
            link: linkFun,
            controller: 'chipsController',
            controllerAs: 'chips',
            template: '<div ng-transclude></div>'
        }

    };
    /* <chip-tmpl> tag is mandatory added validation to confirm that*/
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
        /*get call back method from parent scope*/
        function getCallBack(callBack) {
            var target = $scope.$parent;
            if (callBack !== undefined) {
                if (callBack.split('.').length > 1) {
                    var levels = callBack.split('.');
                    for (var index = 0; index < levels.length; index++) {
                        target = target[levels[index]];
                    }
                } else {
                    target = target[callBack];
                }
            }
            return target;
        }
        /*toggling input controller focus*/
        this.setFocus = function(flag) {
                if (flag) {
                    DomUtil($element).removeClass('chip-out-focus').addClass('chip-in-focus');
                } else {
                    DomUtil($element).removeClass('chip-in-focus').addClass('chip-out-focus');
                }
            }
            /*chip will be removed if call back method return true*/
        this.removeChip = function(data, index) {
            var deleteChip = getCallBack(DomUtil($element).attr('remove-chip')[0])(data);
            if (deleteChip) {
                this.deleteChip(index);
            }
        }
    }
})();

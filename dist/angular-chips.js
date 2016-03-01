(function() {
    angular.module('angular.chips', [])
        .directive('chips', Chips)
        .controller('chipsController', ChipsController);

    function isPromiseLike(obj) {
        return obj && angular.isFunction(obj.then);
    }

    /*
     * update values to ngModel reference
     */
    function ngModel(modelCtrl) {
        return {
            add: function(val) {
                var modelCopy = angular.copy(modelCtrl.$modelValue);
                modelCopy.push(val)
                modelCtrl.$setViewValue(modelCopy);
            },
            delete: function(index) {
                var modelCopy = angular.copy(modelCtrl.$modelValue);
                modelCopy.splice(index, 1);
                modelCtrl.$setViewValue(modelCopy);
            },
            deleteByValue: function(val) {
                var index, resultIndex;
                for (index = 0; index < modelCtrl.$modelValue.length; index++) {
                    if (modelCtrl.$modelValue[index] === val) {
                        resultIndex = index;
                        break;
                    }

                }
                if (resultIndex !== undefined)
                    this.delete(resultIndex)
            }
        }
    }

    function DeferChip(data, promise) {
        var self = this;
        this.data = data;
        this.isLoading = false;
        this.isFailed = false;

        if (promise) {
            self.isLoading = true;
            promise.then(function(data) {
                self.data = data;
                self.isLoading = false;
            }, function() {
                self.isLoading = false;
                self.isFailed = true;
            });
        }
    }

    function Chips($compile, $timeout, DomUtil) {

        function linkFun(scope, iElement, iAttrs, ngModelCtrl, transcludefn) {
            if ((error = validation(iElement)) !== undefined) {
                throw error;
            }

            var model = ngModel(ngModelCtrl);
            var isDeferFlow = iAttrs.hasOwnProperty('defer');

            /*
             *  @scope.chips.addChip should be called by chipControl directive or custom XXXcontrol directive developed by end user
             *  @scope.chips.deleteChip will be called by removeChip directive
             *
             */

            /*
             * ngModel values are copies here
             */
            scope.chips.list;


            scope.chips.addChip = function(data) {
                var updatedData;
                scope.render !== undefined ? updatedData = scope.render({ data: data }) : updatedData = data;
                // isPromiseLike(updatedData) ? deferChip(updatedData).update(data) : update(updatedData);

                if (isPromiseLike(updatedData)) {
                    updatedData.then(function(response) {
                        model.add(response);
                    });
                    scope.chips.list.push(new DeferChip(data, updatedData));
                    scope.$apply();
                } else {
                    update(updatedData);
                }

                function update(data) {
                    scope.chips.list.push(data);
                    model.add(data);
                }
            };

            scope.chips.deleteChip = function(index) {
                var deletedChip = scope.chips.list.splice(index, 1)[0];
                if (deletedChip.isFailed) {
                    scope.$apply();
                    return;
                }

                deletedChip instanceof DeferChip ? model.deleteByValue(deletedChip.data) : model.delete(index);                
            }

            /*
             * ngModel values are copied when it's updated outside
             */
            ngModelCtrl.$render = function() {
                if (isDeferFlow) {
                    var index, list = [];
                    for (index = 0; index < ngModelCtrl.$modelValue.length; index++) {
                        // list.push(ngModelCtrl.$modelValue[index]);
                        list.push(new DeferChip(ngModelCtrl.$modelValue[index]))
                    }
                    scope.chips.list = list;
                } else {
                    scope.chips.list = angular.copy(ngModelCtrl.$modelValue);
                }

            }

            var chipNavigate = null;
            /*
             * @index selected chip index
             * @return function, which will return the chip index based on left or right arrow pressed
             */
            function chipNavigator(index) {
                return function(direction) {
                    direction === 'ArrowLeft' ? index-- : index++;
                    index = index < 0 ? scope.chips.list.length - 1 : index > scope.chips.list.length - 1 ? 0 : index;
                    return index;
                }
            }

            /*Extract the chip-tmpl and compile inside the chips directive scope*/
            var rootDiv = angular.element('<div></div>');
            var tmpl = iElement.find('chip-tmpl').remove();
            var chipTextNode, chipBindedData, chipBindedDataSuffix;

            if (isDeferFlow)
                DomUtil(tmpl).attachDataObjToTextNode();

            tmpl.attr('ng-repeat', 'chip in chips.list track by $index');
            tmpl.attr('ng-class', '{\'chip-failed\':chip.isFailed}')
            tmpl.attr('tabindex', '-1')
            tmpl.attr('index', '{{$index+1}}')
            rootDiv.append(tmpl);
            var node = $compile(rootDiv)(scope);
            iElement.prepend(node);
            /*clicking on chips element should set the focus on INPUT*/
            iElement.on('click', function(event) {
                if (event.target.nodeName === 'CHIPS')
                    iElement.find('input')[0].focus();
            });
            /*on every focus we need to nullify the chipNavigate*/
            iElement.find('input').on('focusin', function() {
                chipNavigate = null;
            });
            /*this method will handle 'delete or Backspace' and left, right key press*/
            iElement.on('keydown', function(event) {
                if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'CHIP-TMPL' || (iElement.find('chip-tmpl').length === 0 && event.target.value === ''))
                    return;

                var chipTmpls;

                function focusOnChip() {
                    chipTmpls = iElement.find('chip-tmpl');
                    chipTmpls[chipTmpls.length - 1].focus();
                    chipNavigate = chipNavigator(chipTmpls.length - 1);
                }

                if (event.code === 'Backspace') {
                    if (event.target.nodeName === 'INPUT' && event.target.value === '') {
                        focusOnChip();
                    } else if (event.target.nodeName === 'CHIP-TMPL') {
                        /*
                         * This block will be called during chip deletion using delete or Backspace key
                         * Below code will set the focus of the next available chip
                         */
                        var chipTemplates = iElement.find('chip-tmpl');
                        if (chipTemplates.length > 0 && parseInt(event.target.getAttribute('index')) - 1 === chipTemplates.length)
                            iElement.find('chip-tmpl')[chipNavigate('ArrowLeft')].focus();
                    }
                } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
                    chipNavigate === null ? focusOnChip() : iElement.find('chip-tmpl')[chipNavigate(event.code)].focus();
                }
            });

            DomUtil(iElement).addClass('chip-out-focus');
        }

        return {
            restrict: 'E',
            scope: {
                /*
                 * optional callback, this will be called before rendering the data, 
                 * user can modify the data before it's rendered
                 */
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
        /*toggling input controller focus*/
        this.setFocus = function(flag) {
            if (flag) {
                DomUtil($element).removeClass('chip-out-focus').addClass('chip-in-focus');
            } else {
                DomUtil($element).removeClass('chip-in-focus').addClass('chip-out-focus');
            }
        }
        this.removeChip = function(data, index) {
            this.deleteChip(index);
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

(function() {
    angular.module('angular.chips')
        .directive('chipTmpl', ChipTmpl);

    function ChipTmpl() {
        return {
            restrict: 'E',
            transclude: true,
            link: function(scope, iElement, iAttrs, contrl, transcludefn) {
                transcludefn(scope, function(clonedTranscludedContent) {
                    iElement.append(clonedTranscludedContent);
                });
                iElement.on('keydown', function(event) {
                    if (event.code === 'Backspace') {
                        scope.$broadcast('chip:delete');
                        event.preventDefault();
                    }
                });
            }
        }
    }
})();

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
                    if (typeof scope.chip !== 'string' && scope.chip.isLoading)
                        return;
                    var callBack, deleteIt = true;
                    if (iAttrs.hasOwnProperty('removeChip') && iAttrs.removeChip !== '') {
                        callBack = getCallBack(findScope(scope, iAttrs.removeChip), iAttrs.removeChip);
                        deleteIt = callBack(scope.chip);
                    }
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

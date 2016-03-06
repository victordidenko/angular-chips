'use strict';

describe('Directive chips', function() {

    beforeEach(module('angular.chips'));

    var element, scope, compile, template, isolateScope, timeout;

    function getChipScope(index) {
        var elements = element.find('chip-tmpl');
        index = index > 0 ? index : (index < 0 ? elements.length - 1 : 0)
        return angular.element(elements[index]).scope();
    }

    /*** Basic flow ***/

    describe('Basic flow', function() {
        beforeEach(inject(function($rootScope, $injector) {
            scope = $rootScope.$new();
            scope.samples = ['Apple', 'Cisco', 'Verizon', 'Microsoft'];
            compile = $injector.get('$compile');
            template = '<chips ng-model="samples">' +
                '<chip-tmpl>' +
                '<div class="default-chip">{{chip}}<span class="glyphicon glyphicon-remove" remove-chip></span></div>' +
                '</chip-tmpl>' +
                '<input chip-control></input>' +
                '</chips>';
            element = angular.element(template);
            compile(element)(scope);
            scope.$digest();
            isolateScope = element.isolateScope();
        }));

        it('check chips.list values', function() {
            expect(scope.samples).toEqual(isolateScope.chips.list);
        });

        it('check adding chip by passing string', function() {
            isolateScope.chips.addChip('Pramati');
            expect(scope.samples.indexOf('Pramati')).not.toBe(-1);
        });

        it('check deleting chip by passing string', function() {
            isolateScope.chips.deleteChip(scope.samples.indexOf('Pramati'));
            expect(scope.samples.indexOf('Pramati')).toBe(-1);
        });
    });

    /*** Custom Rendering ***/

    describe('custom rendering flow', function() {
        beforeEach(inject(function($rootScope, $injector) {
            scope = $rootScope.$new();
            scope.samples = [{ name: 'India', fl: 'I' }, { name: 'China', fl: 'C' }, { name: 'America', fl: 'A' }];
            scope.cutomize = function(val) {
                return { name: val, fl: val.charAt(0) }
            };
            scope.deleteChip = function(obj) {
                return obj.name === 'India' ? false : true;
            };
            compile = $injector.get('$compile');
            template = '<chips ng-model="samples" render="cutomize(val)">' +
                '<chip-tmpl>' +
                '<div class="default-chip">{{chip.name}} , {{chip.fl}}<span class="glyphicon glyphicon-remove" remove-chip="deleteChip(obj)"></span></div>' +
                '</chip-tmpl>' +
                '<input chip-control></input>' +
                '</chips>';
            element = angular.element(template);
            compile(element)(scope);
            scope.$digest();
            isolateScope = element.isolateScope();
        }));

        it('check chips.list values', function() {
            expect(scope.samples).toEqual(isolateScope.chips.list);
        });

        it('check adding chip by passing string', function() {
            isolateScope.chips.addChip('Japan');
            expect(scope.samples[scope.samples.length - 1].name).toBe('Japan');
        });

        it('check deleting chip by passing string', function() {
            getChipScope(1).$broadcast('chip:delete')
            expect(scope.samples[1].name).not.toBe('China');
            expect(scope.samples[1].name).not.toBe('China');
        });

        it('check chip delete restriction', function() {
            getChipScope(0).$broadcast('chip:delete')
                // as per logic 'India' should not delete
            expect(scope.samples[0].name).toBe('India');
        });
    });


    /*** Using Promise with list of string ***/
    describe('Using Promise with list of string', function() {
        beforeEach(inject(function($rootScope, $injector) {
            scope = $rootScope.$new();
            timeout = $injector.get('$timeout');
            scope.samples = ['orange', 'apple', 'grapes'];

            scope.render = function(val) {
                var promise = timeout(function() {
                    return scope.samples.indexOf(val) === -1 ? val : timeout.cancel(promise)
                }, 100);
                return promise;
            };

            scope.deleteChip = function(obj) {
                return true;
            };

            compile = $injector.get('$compile');

            template = '<chips defer ng-model="samples" render="render(data)">' +
                '<chip-tmpl>' +
                '<div class="default-chip">' +
                '{{chip.defer}}' +
                '<span class="glyphicon glyphicon-remove" remove-chip="deleteChip(data)"></span>' +
                '<div class="loader-container" ng-show="chip.isLoading">' +
                '<i class="fa fa-spinner fa-spin fa-lg loader"></i>' +
                '</div>' +
                '</div>' +
                '</chip-tmpl>' +
                '<input chip-control></input>' +
                '</chips>';
            element = angular.element(template);
            compile(element)(scope);
            scope.$digest();
            isolateScope = element.isolateScope();
        }));

        it('check chips.list values', function() {
            expect(scope.samples.length).toEqual(isolateScope.chips.list.length);
        });

        it('check adding chip by passing string', function() {
            isolateScope.chips.addChip('Banana');
            timeout.flush()
            expect(scope.samples[scope.samples.length - 1]).toBe('Banana');
        });

        /*as per render logic above, adding existing string should reject the promise*/
        it('check adding existing chip, as per the logic adding existing string should reject the promise', function() {
            isolateScope.chips.addChip('orange');
            timeout.flush()
            expect(scope.samples[scope.samples.length - 1]).not.toBe('orange');
        });

        it('check deleting chip by passing string', function() {
            getChipScope().$broadcast('chip:delete')
            expect(scope.samples[0].name).not.toBe('orange');
        });
    });


    /*** Using Promise with list of Object ***/
    describe('Using Promise with list of Object', function() {
        beforeEach(inject(function($rootScope, $injector) {
            scope = $rootScope.$new();
            timeout = $injector.get('$timeout');
            scope.usingPromiseObj = {};
            scope.usingPromiseObj.samples = [{ name: 'India', fl: 'I' }, { name: 'China', fl: 'C' }, { name: 'America', fl: 'A' }];

            scope.usingPromiseObj.render = function(val) {
                var promise = timeout(handleRender, 100);

                function handleRender() {
                    if (val === 'India') {
                        timeout.cancel(promise);
                    } else {
                        return { name: val, fl: val.charAt(0) };
                    }
                }
                return promise;
            };

            scope.usingPromiseObj.deleteChip = function(obj) {
                return true;
            };

            compile = $injector.get('$compile');

            template = '<chips defer ng-model="usingPromiseObj.samples" render="usingPromiseObj.render(data)">' +
                '<chip-tmpl>' +
                '<div class="default-chip">' +
                '{{chip.isLoading ? chip.defer : chip.defer.name}}' +
                '<span ng-hide="chip.isLoading">({{chip.defer.fl}})</span>' +
                '<span class="glyphicon glyphicon-remove" remove-chip="usingPromiseObj.deleteChip(data)"></span>' +
                '<div class="loader-container" ng-show="chip.isLoading">' +
                '<i class="fa fa-spinner fa-spin fa-lg loader"></i>' +
                '</div>' +
                '</div>' +
                '</chip-tmpl>' +
                '<input chip-control></input>' +
                '</chips>';

            element = angular.element(template);
            compile(element)(scope);
            scope.$digest();
            isolateScope = element.isolateScope();
        }));

        it('check chips.list values', function() {
            expect(scope.usingPromiseObj.samples.length).toEqual(isolateScope.chips.list.length);
        });

        it('check adding chip by passing string', function() {
            isolateScope.chips.addChip('Swedan');
            timeout.flush()
            expect(scope.usingPromiseObj.samples[scope.usingPromiseObj.samples.length - 1].name).toBe('Swedan');
        });

        it('check deleting chip by passing string', function() {
            getChipScope().$broadcast('chip:delete')
            expect(scope.usingPromiseObj.samples[0].name).not.toBe('India');
        });

        it('check deleting chip while loading', function() {
            isolateScope.chips.addChip('Canada');
            var chipTmpls = element.find('chip-tmpl');
            getChipScope(-1).$broadcast('chip:delete')
            // should not delete while loading
            expect(chipTmpls.length).toEqual(element.find('chip-tmpl').length);
        });

        it('check deleting rejected chip', function() {
            isolateScope.chips.addChip('India');
            //rejected chip won't get added to scope
            expect(scope.usingPromiseObj.samples.length).toBe(3)
            timeout.flush();
            var duplicateChipScope = getChipScope(-1);
            expect(duplicateChipScope.chip.isFailed).toBe(true);
            var chipTmpls = element.find('chip-tmpl');
            duplicateChipScope.$broadcast('chip:delete');
            // rejected chip should get deleted from view
            expect(chipTmpls.length-1).toEqual(element.find('chip-tmpl').length);
        });

    });



});

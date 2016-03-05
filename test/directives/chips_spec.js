'use strict';

describe('Directive chips', function() {

    beforeEach(module('angular.chips'));

    var element, scope, compile, template, isolateScope;

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
            var secondChip = angular.element(element.find('chip-tmpl')[1]);
            var secondChipScope = secondChip.scope();
            secondChipScope.$broadcast('chip:delete')
            expect(scope.samples[1].name).not.toBe('China');
            expect(scope.samples[1].name).not.toBe('China');
        });

        it('check chip delete restriction', function() {
            var firstChip = angular.element(element.find('chip-tmpl')[0]);
            var firstChipScope = firstChip.scope();
            firstChipScope.$broadcast('chip:delete')
                // as per logic 'India' should not delete
            expect(scope.samples[0].name).toBe('India');
        });
    });


    /*** Using Promise with list of string ***/
    var timeout;
    describe('custom rendering flow', function() {
        beforeEach(inject(function($rootScope, $injector) {
            scope = $rootScope.$new();
            timeout = $injector.get('$timeout');
            scope.usingPromiseObj = {};
            scope.usingPromiseObj.samples = ['orange', 'apple', 'grapes'];
            scope.usingPromiseObj.render = function(val) {
                timeout(500, function() {
                    self.list.indexOf(val) === -1 ? deferred.resolve(val) : deferred.reject(val);
                });
                var deferred = q.defer();
                setTimeout(function() {
                    self.list.indexOf(val) === -1 ? deferred.resolve(val) : deferred.reject(val);
                }, 0);
                return deferred.promise;
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

        // it('check adding chip by passing string', function() {
        //     isolateScope.chips.addChip('Banana');
        //     console.log(scope.usingPromiseObj.samples);
        //     expect(scope.usingPromiseObj.samples[scope.usingPromiseObj.samples.length - 1]).toBe('Banana');
        // });

        // it('check deleting chip by passing string', function() {
        //     var secondChip = angular.element(element.find('chip-tmpl')[1]);
        //     var secondChipScope = secondChip.scope();
        //     secondChipScope.$broadcast('chip:delete')
        //     expect(scope.samples[1].name).not.toBe('China');
        //     expect(scope.samples[1].name).not.toBe('China');
        // });

        // it('check chip delete restriction', function() {
        //     var firstChip = angular.element(element.find('chip-tmpl')[0]);
        //     var firstChipScope = firstChip.scope();
        //     firstChipScope.$broadcast('chip:delete')
        //         // as per logic 'India' should not delete
        //     expect(scope.samples[0].name).toBe('India');
        // });
    });



});

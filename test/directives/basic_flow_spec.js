'use strict';

describe('Directive chips : Basic flow', function() {

    beforeEach(module('angular.chips'));

    var element, scope, compile, template, isolateScope, timeout;

    /*** Basic flow ***/

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

    fit('check keydown on chips', function() {
        element[0].click();
        console.log(element[0])
    });

    it('missing chip-tmpl should get error', function() {
        var str = '<chips ng-model="samples">' +
            '<div class="default-chip">{{chip}}<span class="glyphicon glyphicon-remove" remove-chip></span></div>' +
            '<input chip-control></input>' +
            '</chips>';
        var fun = function() { compile(angular.element(str))(scope) };
        expect(fun).toThrow('should have chip-tmpl');
    })

});

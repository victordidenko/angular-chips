(function() {
    angular.module('sample')
        .controller('customRenderingController', CustomRendering);

    function CustomRendering($scope) {
        $scope.list = [{ name: 'India', fl: 'I' }, { name: 'China', fl: 'C' }, { name: 'America', fl: 'A' }];
        this.render = function(val) {
            return { name: val, fl: val.charAt(0) }
        };
        this.deleteChip = function(val){
        	return true;
        }
        this.rm = 'hello';
    }
})();

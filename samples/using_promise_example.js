(function() {
    angular.module('sample')
        .controller('usingPromiseController', UsingPromiseController);

    function UsingPromiseController($scope, $q) {
        this.list = [{name:'Orange'}, {name:'Apple'}, {name:'Grapes'}];
        /*call back method for chip*/
        this.render = function(val) {
            var deferred = $q.defer();
            setTimeout(function(){
                deferred.resolve({name:val})
            },1000);
            return deferred.promise;
        };
        /*call back method for chip delete*/
        this.deleteChip = function(val) {
            return true;
        }
    }
})();

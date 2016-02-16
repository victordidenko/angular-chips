(function(){
	angular.module('sample')
	.controller('inputDemoController', InputDemoController);

	function InputDemoController($scope, $interval){
		var self = this;
		$scope.list = ['sample'];

		self.updatedValue = function(val){
			return 'got it '+ val;
		}
	}
})();
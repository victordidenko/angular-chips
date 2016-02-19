(function(){
	angular.module('sample')
	.controller('inputDemoController', InputDemoController);

	function InputDemoController($scope, $interval, $timeout){
		$scope.list = ['sample','again'];

		this.updatedValue = function(val){
			return 'got it '+ val;
		}

		this.remove = function(data){
			console.log('inputDemoController ',data);
			return true;
		}
	}
})();
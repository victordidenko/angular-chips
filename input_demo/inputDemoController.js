(function(){
	angular.module('sample')
	.controller('inputDemoController', InputDemoController);

	function InputDemoController($scope, $interval, $timeout){
		$scope.list = ['sample sss'];

		this.updatedValue = function(val){
			// return $timeout(1000);
			return 'got it '+ val;
		}

		this.remove = function(data){
			console.log('inputDemoController ',data);
			return true;
		}
	}
})();
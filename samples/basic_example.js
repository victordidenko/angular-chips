(function(){
	angular.module('sample')
	.controller('basicController', BasicController);

	function BasicController($scope, $interval, $timeout){
		$scope.list = ['Apple','Cisco','Verizon','Microsoft'];

		// this.updatedValue = function(val){
		// 	return 'got it '+ val;
		// }

		// this.remove = function(data){
		// 	return true;
		// }
	}
})();
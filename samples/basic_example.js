(function(){
	angular.module('sample')
	.controller('basicController', BasicController);

	function BasicController(){
		this.companies = ['Apple','Cisco','Verizon','Microsoft'];
	}
})();
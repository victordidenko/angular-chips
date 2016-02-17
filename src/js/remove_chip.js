(function(){
	angular.module('angular.chips')
	.directive('removeChip',RemoveChip);

	function RemoveChip(){
		return{
			restrict: 'A',
			require: '^chips',
			link: function(scope, iElement, iAttrs, chipsCtrl){
				iElement.on('click',function(event){
					chipsCtrl.removeChip(scope.chip,scope.$index);
				});
			}
		}
	}	
})();
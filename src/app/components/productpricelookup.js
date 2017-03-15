(function() {
	'use strict';

	angular
	.module('posapp')
	.filter('productPriceLookup', function() {
		return function(paramId, qty, collection) {
			console.log(paramId+' '+qty+' '+collection.length);
			var i=0, len=collection.length;
			var tmp;
			var isFound = false;
			angular.forEach(collection,function(item){
				if(!isFound){
					if(item['priceParamId'] === paramId && qty >= item['min'] && qty <= item['max']){
						tmp = item;
						isFound = true;
					}else{
						tmp = 'nothing';
					}
				}
				
			});
			console.log(tmp.priceValue);
			return tmp;
		}
	});

})();
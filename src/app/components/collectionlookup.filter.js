(function() {
	'use strict';

	angular
	.module('posapp')
	.filter('collectionLookup', function() {
		return function(propertyName, propertyValue, collection) {
			console.log(propertyName+" "+propertyValue);
			var i=0, len=collection.length;
			var tmp;
			var isFound = false;
			angular.forEach(collection,function(item){
				console.log(item[propertyName]);
				if(!isFound){
					if(item[propertyName] === propertyValue){
						tmp = item;
						isFound = true;
					}else{
						tmp = 'nothing';
					}
				}
				
			});
			return tmp;
		}
	});

})();
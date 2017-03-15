(function() {
  'use strict';

  angular
    .module('posapp')
    .service('priceparamService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/priceparam?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(priceparam){
    		return  $http.put(BASE_URL+"/priceparam",priceparam);
    	}

    }]);

})();
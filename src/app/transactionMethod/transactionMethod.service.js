(function() {
  'use strict';

  angular
    .module('posapp')
    .service('transactionMethodService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/transactionMethod?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(salesorder){
    		return  $http.put(BASE_URL+"/transactionMethod",salesorder);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/transactionMethod?id="+id);
    	}

    }]);

})();
(function() {
  'use strict';

  angular
    .module('posapp')
    .service('supplierService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/supplier?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(supplier){
    		return  $http.put(BASE_URL+"/supplier",supplier);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/supplier?id="+id);
    	}

    }]);

})();
(function() {
  'use strict';

  angular
    .module('posapp')
    .service('customerService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/customer?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(brand){
    		return  $http.put(BASE_URL+"/customer",brand);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/customer?id="+id);
    	}

    }]);

})();
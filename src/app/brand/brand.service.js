(function() {
  'use strict';

  angular
    .module('posapp')
    .service('brandService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/brand?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(brand){
    		return  $http.put(BASE_URL+"/brand",brand);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/brand?id="+id);
    	}

    }]);

})();
(function() {
  'use strict';

  angular
    .module('posapp')
    .service('categoryService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/category?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(category){
    		return  $http.put(BASE_URL+"/category",category);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/category?id="+id);
    	}

    }]);

})();
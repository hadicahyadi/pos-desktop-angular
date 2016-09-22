(function() {
  'use strict';

  angular
    .module('posapp')
    .service('productService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/product?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(product){
    		return  $http.put(BASE_URL+"/product",product);
    	}

        this.getByProductCode = function(productCode){
            return $http.get(BASE_URL+"/product/getByProductCode?productCode="+productCode);
        }

        this.export = function(){
            return $http.get(BASE_URL+"/product/export");
        }

    }]);

})();
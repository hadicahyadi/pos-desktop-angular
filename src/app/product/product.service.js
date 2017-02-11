(function() {
  'use strict';

  angular
    .module('posapp')
    .service('productService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber,sortBy,sortValue,criteria){
    		 return $http.get(BASE_URL+"/product?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber+"&orderBy="+sortBy+"&orderValue="+sortValue
          +"&criteria="+criteria);
    	}

    	this.save = function(product){
    		return  $http.put(BASE_URL+"/product",product);
    	}

        this.getByProductCode = function(productCode){
            return $http.get(BASE_URL+"/product/getByProductCode?productCode="+productCode);
        }

        this.export = function(){
            return $http({
              url: BASE_URL+"/product/export",
              method: "POST",
              headers: {
               'Content-type': 'application/json'
             },
             responseType: 'arraybuffer'
           });
        }

        this.findProduct = function(value){
            return $http.get(BASE_URL+"/product/search?searchValue="+value);
        }

    }]);

})();
(function() {
  'use strict';

  angular
    .module('posapp')
    .service('purchaseService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/purchaseorder?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(purchase){
    		return  $http.put(BASE_URL+"/purchaseorder",purchase);
    	}

        this.search = function(searchValue,itemsPerPage,pageNumber){
            return $http.get(BASE_URL+"/purchaseorder/search?searchValue="+searchValue
                +"&itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
        }

        this.getDetail = function(id){
            return $http.get(BASE_URL+"/purchaseorder/detail?id="+id);
        }

    }]);

})();
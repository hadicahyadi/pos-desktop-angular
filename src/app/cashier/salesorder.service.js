(function() {
  'use strict';

  angular
    .module('posapp')
    .service('salesOrderService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/salesorder?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(salesorder){
    		return  $http.put(BASE_URL+"/salesorder",salesorder);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/salesorder?id="+id);
    	}

        this.getDetail = function(id){
            return $http.get(BASE_URL+"/salesorder/detail?id="+id);
        }

        this.reprint = function(id){
            return $http.post(BASE_URL+"/salesorder/print?id="+id);
        }

        this.getByPriceType = function(priceType,itemsPerPage,pageNumber){
            return $http.get(BASE_URL+"/salesorder/search?priceType="+priceType+"&itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
        }

    }]);

})();
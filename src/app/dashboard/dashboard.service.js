(function() {
  'use strict';

  angular
    .module('posapp')
    .service('dashboardService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getSalesSummary = function (){
    		 return $http.get(BASE_URL+"/dashboard/salesSummary");
    	}

        this.getPurchaseDebt = function (){
             return $http.get(BASE_URL+"/dashboard/purchaseDebt");
        }

        this.getLowStockProduct = function (){
             return $http.get(BASE_URL+"/dashboard/lowStockProduct");
        }

        this.getSalesOrderCredit = function (){
             return $http.get(BASE_URL+"/dashboard/salesOrderCredit");
        }

    }]);

})();
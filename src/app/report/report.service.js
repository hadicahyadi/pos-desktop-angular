(function() {
  'use strict';

  angular
    .module('posapp')
    .service('reportService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getSalesSummary = function (start,end){
    		 return $http.get(BASE_URL+"/report/salesSummary?start="+start+"&end="+end);
    	}

      this.exportSalesSummary = function(start,end){
            // return $http.post(BASE_URL+"/report/exportSalesSummary?start="+start+"&end="+end);
            return $http({
              url: BASE_URL+"/report/exportSalesSummary",
              method: "POST",
              data: {"start":start,"end":end}, //this is your json data string
              headers: {
               'Content-type': 'application/json'
             },
             responseType: 'arraybuffer'
           });
      }

      this.getTransactionSummary = function(start,end){
        return $http.get(BASE_URL+"/report/transactionSummary?start="+start+"&end="+end);
      }

    }]);

})();
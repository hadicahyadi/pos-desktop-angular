(function() {
  'use strict';

  angular
  .module('posapp')
  .controller('SalesSummaryController',  ['$state','$log','BASE_URL','$scope','reportService', SalesSummaryController]);


  /** @ngInject */
  function SalesSummaryController($state,$log,BASE_URL,$scope,reportService) {
  	var vm = this;

    $scope.$parent.pageTitle= "End of Day Report";
    vm.start = moment(new Date()).format("DD/MM/YYYY");
    vm.end = moment(new Date()).format("DD/MM/YYYY");
    vm.salesSummary = null;
    vm.grossSales = 0;
    vm.netSales = 0;
    vm.discount = 0;
    vm.totalSales = 0;
    vm.baseTotal = 0;
    vm.profit = 0;
    // vm.period = 'MONTHLY';
    vm.date = 'Period';

    vm.loadSalesSummary = function(){
      reportService.getSalesSummary(vm.start,vm.end).then(function successCallback(response){
        $log.info(response.data);
        vm.salesSummary = response.data;
        vm.grossSales = response.data.grossSales;
        vm.netSales = response.data.netSales;
        vm.discount = response.data.discount;
        vm.totalSales = response.data.totalSales;
        vm.baseTotal = response.data.baseTotal;
        vm.profit = response.data.profit;
      },
      function errorCallback(response){
        $log.info(response);
      });
    }

    vm.download = function(){
      $log.info(JSON.stringify(vm.salesSummary));
      /*angular.forEach(vm.salesSummary,function(key,value){
        $log.info(key);
        $log.info(value);
        arr.push(key);
      });*/
      reportService.exportSalesSummary(vm.start,vm.end).success(function (data, status, headers, config) {
        var blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        var date = new Date();
        vm.filename = 'SALES_SUMMARY_'+date.getFullYear()+('0' + (date.getMonth() + 1)).slice(-2)+('0' + date.getDate()).slice(-2);
        saveAs(blob, vm.filename + '.xlsx');
      });
    }

 }

})();

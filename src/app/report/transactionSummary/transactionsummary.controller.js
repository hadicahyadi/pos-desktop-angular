(function() {
  'use strict';

  angular
  .module('posapp')
  .controller('TransactionSummaryController',  ['$state','$log','BASE_URL','$scope','reportService', TransactionSummaryController]);


  /** @ngInject */
  function TransactionSummaryController($state,$log,BASE_URL,$scope,reportService) {
  	
    var vm = this;
    $scope.$parent.pageTitle = 'Transaction Summary';
    vm.start = moment(new Date()).format("DD/MM/YYYY");
    vm.end = moment(new Date()).format("DD/MM/YYYY");
    vm.transactionCount = 0;
    vm.transactionSum = 0;
    vm.netSum = 0;

    this.load = function(){
      reportService.getTransactionSummary(vm.start,vm.end).then(function successCallback(response){
        $log.info(response);
        vm.transactionCount = response.data.transactionCount;
        vm.transactionSum = response.data.transactionSum;
        vm.netSum = response.data.netSum;
      },
      function errorCallback(response){
        $log.info(response);
      });
    }
 }

})();

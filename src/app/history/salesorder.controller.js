(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('SalesOrderController',  ['$state','$http','$log','BASE_URL','$scope','salesOrderService','PAGE_SIZE', SalesOrderController]);


	

  /** @ngInject */
  function SalesOrderController($state,$http,$log,BASE_URL,$scope,salesOrderService,PAGE_SIZE) {
  	var vm = this;

    $scope.$parent.pageTitle= "Sales Order History";

    vm.salesorders = [];
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = PAGE_SIZE;

  	load();

	function load(){
		salesOrderService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			$log.info(response);
			vm.salesorders = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}


	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();

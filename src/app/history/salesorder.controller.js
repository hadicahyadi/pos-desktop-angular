(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('SalesOrderController',  ['$state','$http','$log','BASE_URL','PAGE_SIZE','$scope','salesOrderService', SalesOrderController]);


	

  /** @ngInject */
  function SalesOrderController($state,$http,$log,BASE_URL,PAGE_SIZE,$scope,salesOrderService) {
  	var vm = this;

    $scope.$parent.pageTitle= "Sales Order History";

    vm.salesorders = [];
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = 10;

  	load();

	function load(){
		salesOrderService.getAll(PAGE_SIZE,vm.currentPage).success(function(response){
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

(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('PurchaseHistoryController',  ['$state','$http','$log','BASE_URL','$scope','purchaseService','toastr', PurchaseHistoryController]);


  /** @ngInject */
  function PurchaseHistoryController($state,$http,$log,BASE_URL,$scope,purchaseService,toastr) {
  	var vm = this;

    $scope.$parent.pageTitle= "Purchase Order History";

    vm.purchaseOrders = [];
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = 5;
	vm.searchValue = '';
	vm.detailId = null;
	vm.details = [];
	vm.selectedPO = null;
	vm.purchaseOrder = null;

	vm.load = function(){
		purchaseService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			$log.info(response);
			vm.purchaseOrders = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.search = function(){
		purchaseService.search(vm.searchValue,99,1).then(function successCallback(response){
			$log.info(response);
			vm.purchaseOrders = [].concat(response.data);
			vm.dataCount = response.pageCount;
			vm.searchValue = '';
			if(vm.purchaseOrders.length == 0){
				toastr.success('No data found','Result');
			}
		},
		function errorCallback(response){
			$log.info(response);
			toastr.error(response.data.message,'Failed');
		});
	}

	vm.loadDetail = function(){
		purchaseService.getDetail(vm.purchaseOrder.id).then(function successCallback(response){
			$log.info(response);
			vm.details = [].concat(response.data);
		},
		function errorCallback(response){
			$log.info(response);
			toastr.error(response.data.message,'Failed');
		});
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();

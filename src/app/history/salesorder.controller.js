(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('SalesOrderController',  ['$state','$http','$log','toastr','BASE_URL','$scope','salesOrderService','priceparamService','PAGE_SIZE', SalesOrderController]);


	/** @ngInject */
	function SalesOrderController($state,$http,$log,toastr,BASE_URL,$scope,salesOrderService,priceparamService,PAGE_SIZE) {
		var vm = this;

		$scope.$parent.pageTitle= "Sales Order History";

		vm.salesorders = [];
		vm.dataCount = 0;
		vm.currentPage = 1;
		vm.pageSize = PAGE_SIZE;
		vm.salesorder = null;
		vm.details = [];
		vm.priceParam = null;

		vm.load = function(){
			salesOrderService.getAll(vm.pageSize,vm.currentPage).success(function(response){
				vm.salesorders = [].concat(response.datas);
				vm.dataCount = response.pageCount;
			});
		}

		vm.loadPriceParam = function(){
      priceparamService.getAll(99,1).success(function(response){
        vm.priceParams = [].concat(response.datas);
      });
    }

		vm.pageChangeHandler = function pageChangeHandler(pageNumber){
			vm.currentPage = pageNumber;
			load();
		}

		vm.loadDetail = function(){
			salesOrderService.getDetail(vm.salesorder.id).then(function successCallback(response){
				$log.info(response);
				vm.details = [].concat(response.data);
			}, function errorCallback(response){
				$log.error(response);
				toastr.error(response.data.message,'Failed');
			});
		}

		vm.reprint = function(id){
			salesOrderService.reprint(id);
		}

		vm.search = function(){
			salesOrderService.getByPriceType(vm.priceParam,vm.pageSize,vm.currentPage).then(function successCallback(response){
				$log.info(response);
				vm.salesorders = [].concat(response.data.datas);
				vm.dataCount = response.data.pageCount;
				if(vm.salesorders.length == 0){
					toastr.success('No data found','Result');
				}
			},function errorCallback(response){
				toastr.error(response.data.message,'Failed');
			});
		}


	}

})();

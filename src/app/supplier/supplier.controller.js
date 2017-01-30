(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('SupplierController',  ['$state','$http','$log','BASE_URL','$scope','supplierService','toastr','PAGE_SIZE', SupplierController]);

  
  /** @ngInject */
  function SupplierController($state,$http,$log,BASE_URL,$scope,supplierService,toastr,PAGE_SIZE) {

  	var vm = this;

    $scope.$parent.pageTitle= "Supplier";

    vm.isEditPage = false;

    vm.supplier = {
    	id: null,
    	supplierName: null,
    	address: null,
    	phoneNumber: null
    };

    vm.suppliers = [];
	vm.remove = remove;
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = PAGE_SIZE;
	
	load();

	function load(){
		vm.supplier = null;
		supplierService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			vm.suppliers = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.isEdit = function isEdit(){
		if(vm.supplier == null){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

	vm.save = function() {
		supplierService.save(vm.supplier).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.supplier");
			vm.supplier = null;
			vm.currentPage = 1;
			toastr.success(response.data.message,'');
			load();
		},
		function errorCallback(response){
			$log.error(response);
			toastr.error(response.data.message,'Failed');
		});
	}

	function remove(id){
		supplierService.remove(id).then(function successCallback(response){
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			toastr.success(response.data.message,'Failed');
		});
	}

	vm.edit = function edit(supplier){
		vm.isEditPage = true;
		vm.supplier = supplier;
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

  }

})();

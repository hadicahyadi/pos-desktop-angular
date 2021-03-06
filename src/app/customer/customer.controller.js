(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('CustomerController',  ['$state','$http','$log','BASE_URL','$scope','customerService','toastr','PAGE_SIZE', CustomerController]);

  
  /** @ngInject */
  function CustomerController($state,$http,$log,BASE_URL,$scope,customerService,toastr,PAGE_SIZE) {

  	var vm = this;

    $scope.$parent.pageTitle= "Customer";

    vm.customer = {
    	id: null,
    	customerName: null,
    	address: null,
    	phoneNumber: null
    };

    vm.customers = [];
	vm.remove = remove;
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = PAGE_SIZE;
	
	load();

	function load(){
		customerService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			vm.customers = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.isEdit = function isEdit(){
		if(vm.customer === null){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

	vm.save = function() {
		customerService.save(vm.customer).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.customer");
			vm.customer = null;
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
		customerService.remove(id).then(function successCallback(response){
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			toastr.error(response.data.message,'Failed');
		});
	}

	vm.edit = function edit(customer){
		vm.customer = customer;
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();

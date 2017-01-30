(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('BrandController',  ['$state','$http','$log','BASE_URL','$scope','brandService','toastr','PAGE_SIZE', BrandController]);

  
  /** @ngInject */
  function BrandController($state,$http,$log,BASE_URL,$scope,brandService,toastr,PAGE_SIZE) {

  	var vm = this;

    $scope.$parent.pageTitle= "Brand";

    vm.brand = {
    	id: null,
    	brandName: null
    };

    vm.brands = [];
	vm.remove = remove;
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = PAGE_SIZE;
	
	load();

	function load(){
		brandService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			vm.brands = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.isEdit = function isEdit(){
		if(vm.brand === null){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

	vm.save = function() {
		brandService.save(vm.brand).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.brand");
			vm.brand = null;
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
		brandService.remove(id).then(function successCallback(response){
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			toastr.error(response.data.message,'Failed');
		});
	}

	vm.edit = function edit(brand){
		vm.brand = brand;
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();

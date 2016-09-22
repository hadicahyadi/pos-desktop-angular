(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('CategoryController',  ['$state','$http','$log','BASE_URL','$scope','categoryService', CategoryController]);


	

  /** @ngInject */
  function CategoryController($state,$http,$log,BASE_URL,$scope,categoryService) {
  	var vm = this;

    $scope.$parent.pageTitle= "Category";

    vm.category = {
    	id: null,
    	categoryName: null
    };

    vm.isEdit = function isEdit(){
		if(vm.category === null){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

    vm.categories = [];
	vm.remove = remove;
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = 5;
	
	load();

	function load(){
		categoryService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			$log.info(response);
			vm.categories = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.save = function() {
		categoryService.save(vm.category).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.category");
			vm.category = null;
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			alert('save data error!');
		});
	}

	function remove(id){
		categoryService.remove(id).then(function successCallback(response){
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			alert('delete data error!');
		});
	}

	vm.edit = function edit(category){
		vm.category = category;
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();

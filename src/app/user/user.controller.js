(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('UserController',  ['$state','$http','$log','BASE_URL','$scope','userService','toastr', UserController]);


  /** @ngInject */
  function UserController($state,$http,$log,BASE_URL,$scope,userService,toastr) {
  	var vm = this;

    $scope.$parent.pageTitle= "User";

    vm.user = {
    	id: null,
    	roleId: null,
    	name: null,
    	username: null,
    	password: null
    };

    vm.isEdit = function isEdit(param){
		if(param === null){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

    vm.users = [];
	vm.remove = remove;
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = 5;
	
	load();

	function load(){

		userService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			$log.info(response);
			vm.users = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.save = function() {
		userService.save(vm.user).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.user");
			vm.user = null;
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
		userService.remove(id).then(function successCallback(response){
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			toastr.success(response.data.message,'Failed');
		});
	}

	vm.edit = function edit(user){
		vm.user = user;
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();
